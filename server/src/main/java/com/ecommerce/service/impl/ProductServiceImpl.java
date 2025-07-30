package com.ecommerce.service.impl;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.ecommerce.dto.*;
import com.ecommerce.mapper.ProductMapper;
import com.ecommerce.mapper.ReviewMapper;
import com.ecommerce.mapper.SearchHistoryMapper;
import com.ecommerce.model.*;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.service.ProductESService;
import com.ecommerce.service.ProductService;
import com.ecommerce.utility.DtoValidatorUtil;
import com.ecommerce.utility.Pagination1BasedUtil;
import com.ecommerce.utility.PaginationUtil;
import com.ecommerce.utility.QuantityCalculatorUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.ecommerce.exception.ProductException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.request.ProductRequest;

@Slf4j
@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final ProductESService productESService;

    @Override
    public Product createProduct(ProductRequest req) throws ProductException {

        // Validate the request
        DtoValidatorUtil.validate(req);

        // Validate price and discounted price
        if (req.getDiscountedPrice() > req.getPrice()) {
            throw new ProductException("Discounted price must be less than or equal to the actual price");
        }

        // Define allowed size names
        Set<String> allowedSizes = Set.of("XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40");

        // Validate sizes
        for (Size size : req.getSizes()) {
            if (size.getQuantity() < 0) {
                throw new ProductException("Size quantity cannot be negative");
            }
            if (!allowedSizes.contains(size.getName())) {
                throw new ProductException("Invalid size name: " + size.getName() + ". Allowed sizes are: " + allowedSizes);
            }
        }

        // Find or create top-level category
        Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
        if (topLevel == null) {
            topLevel = new Category(req.getTopLevelCategory(), 1, null);
            topLevel = categoryRepository.save(topLevel);
        }

        // Find or create second-level category
        Category secondLevel = categoryRepository.findByNameAndParent(req.getSecondLevelCategory(), topLevel.getName());
        if (secondLevel == null) {
            secondLevel = new Category(req.getSecondLevelCategory(), 2, topLevel);
            secondLevel = categoryRepository.save(secondLevel);
        }

        // Find or create third-level category
        Category thirdLevel = categoryRepository.findByNameAndParent(req.getThirdLevelCategory(), secondLevel.getName());
        if (thirdLevel == null) {
            thirdLevel = new Category(req.getThirdLevelCategory(), 3, secondLevel);
            thirdLevel = categoryRepository.save(thirdLevel);
        }

        // Calculate quantity dynamically from sizes
        int totalQuantity = QuantityCalculatorUtil.getTotalQuantity(req.getSizes());

        // Create and populate the product
        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setDiscountedPrice(req.getDiscountedPrice());
        product.setDiscountPercent(((req.getPrice() - req.getDiscountedPrice()) * 100) / req.getPrice());
        product.setBrand(req.getBrand());
        product.setColor(req.getColor());
        product.setSizes(req.getSizes());
        product.setQuantity(totalQuantity);
        product.setPreview(req.getPreview());
        product.setImages(req.getImages());
        product.setFeatured(req.isFeatured());
        product.setCategory(thirdLevel);
        product.setCreatedAt(LocalDateTime.now());

        try {
            // Save the product to the Database
            Product savedProduct = productRepository.save(product);
            // Save the product to Elasticsearch
            productESService.createProduct(ProductMapper.toProductES(savedProduct));
            return savedProduct;
        } catch (Exception e) {
            throw new ProductException("Failed to create product: " + e.getMessage());
        }

    }

    @Override
    public Product fullUpdate(Long productId, ProductRequest req) throws ProductException {

        // Validate the incoming Product object
        DtoValidatorUtil.validate(req);

        // Delegate to the existing update logic (reuse updateProduct logic)
        return updateProduct(productId, req);

    }

    @Override
    public Product partialUpdate(Long productId, ProductRequest req) throws ProductException {

        // Delegate to the existing update logic (reuse updateProduct logic)
        return updateProduct(productId, req);

    }

    public Product updateProduct(Long productId, ProductRequest req) throws ProductException {

        // Find the existing product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found"));

        boolean priceUpdated = false;
        boolean discountedPriceUpdated = false;

        // Update fields dynamically using a map for non-primitive and non-collection types
        Map<Runnable, Boolean> updateActions = Map.of(
                () -> product.setDescription(req.getDescription()), req.getDescription() != null,
                () -> product.setFeatured(req.isFeatured()), req.isFeatured(),
                () -> product.setPreview(req.getPreview()), req.getPreview() != null && !req.getPreview().isEmpty(),
                () -> product.setBrand(req.getBrand()), req.getBrand() != null && !req.getBrand().isEmpty(),
                () -> product.setColor(req.getColor()), req.getColor() != null && !req.getColor().isEmpty(),
                () -> product.setTitle(req.getTitle()), req.getTitle() != null && !req.getTitle().isEmpty()
        );

        updateActions.forEach((action, condition) -> {
            if (condition) action.run();
        });

        // Update numeric fields directly
        if (req.getPrice() > 0 && req.getPrice() >= product.getDiscountedPrice()) {
            product.setPrice(req.getPrice());
            priceUpdated = true;
        }
        if (req.getDiscountedPrice() > 0 && req.getDiscountedPrice() <= product.getPrice()) {
            product.setDiscountedPrice(req.getDiscountedPrice());
            discountedPriceUpdated = true;
        }

        // Check and update sizes
        if (req.getSizes() != null && !req.getSizes().isEmpty()) {
            // Update sizes if provided
            product.setSizes(req.getSizes());

            // Update the total quantity using QuantityCalculatorUtil
            int updatedQuantity = QuantityCalculatorUtil.getTotalQuantity(product.getSizes());
            product.setQuantity(updatedQuantity);
        }

        // Update images if provided
        if (req.getImages() != null && !req.getImages().isEmpty()) {
            product.setImages(new ArrayList<>(req.getImages()));
        }

        // Recalculate discountPercent if price or discountedPrice was updated
        if (priceUpdated || discountedPriceUpdated) {
            int price = product.getPrice();
            int discountedPrice = product.getDiscountedPrice();
            int discountPercent = 0;

            if (discountedPrice >= 0 && discountedPrice < price) {
                discountPercent = ((price - discountedPrice) * 100) / price;
            }
            product.setDiscountPercent(discountPercent);
        }

        // Update categories
        if (req.getTopLevelCategory() != null && !req.getTopLevelCategory().isEmpty() &&
                req.getSecondLevelCategory() != null && !req.getSecondLevelCategory().isEmpty() &&
                req.getThirdLevelCategory() != null && !req.getThirdLevelCategory().isEmpty()) {

            // Ensure the top-level category exists or create it
            Category topLevelCategory = categoryRepository.findByName(req.getTopLevelCategory());
            if (topLevelCategory == null) {
                topLevelCategory = new Category(req.getTopLevelCategory(), 1, null); // Top-level has no parent
                topLevelCategory = categoryRepository.save(topLevelCategory);
            }

            // Ensure the second-level category exists or create it
            Category secondLevelCategory = categoryRepository.findByNameAndParent(req.getSecondLevelCategory(), topLevelCategory.getName());
            if (secondLevelCategory == null) {
                secondLevelCategory = new Category(req.getSecondLevelCategory(), 2, topLevelCategory); // Parent is top-level
                secondLevelCategory = categoryRepository.save(secondLevelCategory);
            }

            // Ensure the third-level category exists or create it
            Category thirdLevelCategory = categoryRepository.findByNameAndParent(req.getThirdLevelCategory(), secondLevelCategory.getName());
            if (thirdLevelCategory == null) {
                thirdLevelCategory = new Category(req.getThirdLevelCategory(), 3, secondLevelCategory); // Parent is second-level
                thirdLevelCategory = categoryRepository.save(thirdLevelCategory);
            }

            // Associate the product with the third-level category
            product.setCategory(thirdLevelCategory);
        }

        // Save and return the updated product
        return productRepository.save(product);

    }

    @Override
    public String deleteProduct(Long productId) throws ProductException {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found"));
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product deleted Successfully";

    }

    @Override
    public Page<Product> getAllProducts(Integer pageNumber, Integer pageSize) {

        // Find all products
        List<Product> products = productRepository.findAll();
        return PaginationUtil.paginateList(products, pageNumber, pageSize);

    }

    @Override
    public Page<ProductMLDto> getLimitedProducts(Integer pageNumber, Integer pageSize) {

        // Find all products
        List<Product> products = productRepository.findAll();
        return PaginationUtil.paginateList(ProductMapper.toProductMLDtoList(products), pageNumber, pageSize);

    }

    @Override
    public ProductDto findProductById(Long id) throws ProductException {

        Optional<Product> opt = productRepository.findById(id);
        if (opt.isPresent()) {
            return ProductMapper.toDto(opt.get());
        }
        throw new ProductException("product not found with id " + id);

    }

    @Override
    public Page<Product> searchProductByCategory(String category, Integer pageNumber, Integer pageSize) {

        // Search for products using the query
        List<Product> products = productRepository.findProductsByCategoryName(category);
        return PaginationUtil.paginateList(products, pageNumber, pageSize);

    }

    @Override
    public Page<SearchDto> findSimilarProducts(Long productId, Integer pageNumber, Integer pageSize) throws ProductException {
        // Find all products
        List<Product> products = productRepository.findAll();

        // Find the product by ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product with id " + productId + " not found"));

        // Extract the color keywords (splitting by spaces)
        Set<String> productColorKeywords = Arrays.stream(product.getColor().split("\\s+"))
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        // Find products with the same category and at least one matching color keyword
        products = products.stream()
                .sorted(Comparator.comparing(Product::getAverageRating).reversed())
                .filter(p -> p.getCategory().equals(product.getCategory()) &&
                        p.getQuantity() > 0 &&
                        hasMatchingColor(p.getColor(), productColorKeywords)) // Check if colors match
                .collect(Collectors.toList());

        // Remove the original product from the list
        products.remove(product);

        // Convert to DTO
        List<SearchDto> similarProducts = ProductMapper.toSearchDtoList(products);
        return Pagination1BasedUtil.paginateList(similarProducts, pageNumber, pageSize);
    }

    private boolean hasMatchingColor(String productColor, Set<String> targetColorKeywords) {
        if (productColor == null || productColor.isEmpty()) return false;

        Set<String> productColorKeywords = Arrays.stream(productColor.split("\\s+"))
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        // Check if any keyword from the target color matches this product's color
        return productColorKeywords.stream().anyMatch(targetColorKeywords::contains);
    }

    @Override
    public Page<SearchDto> findLikeProducts(Long productId, Integer pageNumber, Integer pageSize) throws ProductException {

        // Find all products
        List<Product> products = productRepository.findAll();

        // Find the product by ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product with id " + productId + " not found"));

        // Find products with the same category and sort by average rating
        products = products.stream()
                .sorted(Comparator.comparing(Product::getAverageRating).reversed())
                .filter(p -> p.getCategory().equals(product.getCategory()) && p.getQuantity() > 0)
                .collect(Collectors.toList());

        // Remove the product itself from the list
        products.remove(product);

        List<SearchDto> similarProducts = ProductMapper.toSearchDtoList(products);
        return Pagination1BasedUtil.paginateList(similarProducts, pageNumber, pageSize);

    }

    @Override
    public Page<SearchDto> searchProducts(String query, List<String> category, Integer minPrice, Integer maxPrice,
                                          List<String> brand, List<String> size, List<String> color, Integer discount,
                                          Double rating, String sort, Integer pageNumber, Integer pageSize) throws ProductException {

        List<Product> products = productRepository.findAll();

        // Apply search query
        if (query != null && !query.isEmpty()) {
            String[] searchTerms = query.split(" ");

            products = products.stream()
                    .filter(product -> {
                        // Exclude out-of-stock products
                        if (product.getQuantity() <= 0) return false;

                        // Check if the product matches all the search terms
                        for (String term : searchTerms) {
                            term = term.trim().toLowerCase(); // Normalize the term

                            // Check if the term exists in title, description, brand, or color
                            boolean matchesProductFields =
                                    product.getTitle().toLowerCase().contains(term) ||
                                            product.getDescription().toLowerCase().contains(term) ||
                                            product.getBrand().toLowerCase().contains(term) ||
                                            product.getColor().toLowerCase().contains(term);

                            // Check if the term exists in the category hierarchy
                            boolean matchesCategoryHierarchy = false;
                            Category cat = product.getCategory();
                            while (cat != null) {
                                if (cat.getName().toLowerCase().contains(term)) {
                                    matchesCategoryHierarchy = true;
                                    break;
                                }
                                cat = cat.getParentCategory();
                            }

                            // If the term is not found in any field or category hierarchy, exclude the product
                            if (!matchesProductFields && !matchesCategoryHierarchy) {
                                return false; // Product does not match this term
                            }
                        }
                        return true; // Product matches ALL terms
                    })
                    .toList();
        }

        // Sorting the products by category and rank score
        // Step 1: After applying all filters and search query
        Map<String, List<Product>> categoryGroups = products.stream()
                .collect(Collectors.groupingBy(p -> p.getCategory().getName().toLowerCase()));

        // Step 2: Identify the dominant category
        String dominantCategory = categoryGroups.entrySet().stream()
                .max(Comparator.comparingInt(entry -> entry.getValue().size()))
                .map(Map.Entry::getKey)
                .orElse(null);

        // Step 3: Separate products
        List<Product> dominantCategoryProducts = categoryGroups.getOrDefault(dominantCategory, new ArrayList<>());
        List<Product> otherProducts = products.stream()
                .filter(p -> !p.getCategory().getName().equalsIgnoreCase(dominantCategory))
                .collect(Collectors.toList());

        // Step 4: Sort both lists by rankScore
        dominantCategoryProducts.sort((p1, p2) -> Double.compare(p2.getRankScore(), p1.getRankScore()));
        otherProducts.sort((p1, p2) -> Double.compare(p2.getRankScore(), p1.getRankScore()));

        // Step 5: Merge
        List<Product> searchedProducts = new ArrayList<>();
        searchedProducts.addAll(dominantCategoryProducts);
        searchedProducts.addAll(otherProducts);

        // Apply category filter
        if (category != null && !category.isEmpty()) {
            Set<String> categorySet = category.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            searchedProducts = searchedProducts.stream()
                    .filter(product -> categorySet.contains(product.getCategory().getName().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Apply minPrice filter
        if (minPrice != null) {
            searchedProducts = searchedProducts.stream()
                    .filter(product -> product.getDiscountedPrice() >= minPrice)
                    .collect(Collectors.toList());
        }

        // Apply maxPrice filter
        if (maxPrice != null) {
            searchedProducts = searchedProducts.stream()
                    .filter(product -> product.getDiscountedPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        // Apply brand filter
        if (brand != null && !brand.isEmpty()) {
            Set<String> brandSet = brand.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            searchedProducts = searchedProducts.stream()
                    .filter(product -> brandSet.contains(product.getBrand().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Apply size filter
        if (size != null && !size.isEmpty()) {
            Set<String> sizeSet = size.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            searchedProducts = searchedProducts.stream()
                    .filter(product -> product.getSizes().stream()
                            .anyMatch(s -> sizeSet.contains(s.getName().toLowerCase())))
                    .collect(Collectors.toList());
        }

        // Apply color filter
        if (color != null && !color.isEmpty()) {
            Set<String> colorSet = color.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            searchedProducts = searchedProducts.stream()
                    .filter(product -> colorSet.contains(product.getColor().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Apply discount filter
        if (discount != null) {
            searchedProducts = searchedProducts.stream()
                    .filter(product -> product.getDiscountPercent() >= discount)
                    .collect(Collectors.toList());
        }

        // Apply minRating filter
        if (rating != null) {
            searchedProducts = searchedProducts.stream()
                    .filter(product -> product.getAverageRating() >= rating)
                    .collect(Collectors.toList());
        }

        // Apply sorting
        if (sort != null && !sort.isEmpty()) {
            switch (sort.toLowerCase()) {
                case "name_asc":
                    searchedProducts.sort(Comparator.comparing(Product::getTitle, String.CASE_INSENSITIVE_ORDER));
                    break;
                case "name_desc":
                    searchedProducts.sort((p1, p2) -> p2.getTitle().compareToIgnoreCase(p1.getTitle()));
                    break;
                case "price_low":
                    searchedProducts.sort(Comparator.comparingInt(Product::getDiscountedPrice));
                    break;
                case "price_high":
                    searchedProducts.sort((p1, p2) -> Integer.compare(p2.getDiscountedPrice(), p1.getDiscountedPrice()));
                    break;
                case "rating_high":
                    searchedProducts.sort((p1, p2) -> Double.compare(p2.getAverageRating(), p1.getAverageRating()));
                    break;
                case "rating_low":
                    searchedProducts.sort(Comparator.comparingDouble(Product::getAverageRating));
                    break;
                default:
                    break;
            }
        }

        List<SearchDto> searchedProductsDto = ProductMapper.toSearchDtoList(searchedProducts);
        return Pagination1BasedUtil.paginateList(searchedProductsDto, pageNumber, pageSize);

    }

    @Override
    public ReviewsDto getReviews(Long productId) throws ProductException {
        // Getting the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found"));

        // Get all the reviews of the product
        List<Review> reviews = reviewRepository.findByProductId(productId);

        // Sort by Date & Map Review entities to UserReviewDto using ReviewMapper
        List<ReviewDto> reviewDtos = reviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .map(ReviewMapper::mapToDto)
                .toList();

        // Calculate review stats
        int total = reviews.size();
        double average = product.getAverageRating();

        int fiveStar = 0, fourStar = 0, threeStar = 0, twoStar = 0, oneStar = 0;
        for (Review review : reviews) {
            int rating = (int) Math.floor(review.getRating());
            if (rating >= 1 && rating <= 5) {
                switch (rating) {
                    case 5 -> fiveStar++;
                    case 4 -> fourStar++;
                    case 3 -> threeStar++;
                    case 2 -> twoStar++;
                    case 1 -> oneStar++;
                }
            }
        }

        ReviewStatsDto stats = new ReviewStatsDto(total, average, fiveStar, fourStar, threeStar, twoStar, oneStar);

        // Create and return the UserReviewsDto
        return new ReviewsDto(reviewDtos, stats);
    }

    @Override
    public List<SearchHistoryDto> fetchSearchAutocomplete(String query) throws Exception {
        return SearchHistoryMapper.EStoDtoList(productESService.autocompleteSearch(query));
    }

}
