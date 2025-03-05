package com.ecommerce.service.impl;


import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.request.ProductRequest;
import com.ecommerce.model.Size;

@Slf4j
@Service
@AllArgsConstructor
public class ProductServiceImplementation implements ProductService {

    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;

    @Override
    public Product createProduct(ProductRequest req) throws ProductException {

        System.out.println("createProduct method triggered");

        // Validate the request
        DtoValidatorUtil.validate(req);

        // Validate price and discounted price
        if (req.getDiscountedPrice() > req.getPrice()) {
            throw new ProductException("Discounted price must be less than or equal to the actual price");
        }

        // Validate sizes to be not negative
        for (Size size : req.getSizes()) {
            if (size.getQuantity() < 0) {
                throw new ProductException("Size quantity cannot be negative");
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
        product.setImageUrl(req.getImageUrl());
        product.setFeatured(req.isFeatured());
        product.setCategory(thirdLevel);
        product.setCreatedAt(LocalDateTime.now());

        // Save and return the product
        return productRepository.save(product);

    }

    @Override
    public Product fullUpdate(Long productId, ProductRequest req) throws ProductException {

        System.out.println("fullUpdate method triggered");

        // Validate the incoming Product object
        DtoValidatorUtil.validate(req);

        // Delegate to the existing update logic (reuse updateProduct logic)
        return updateProduct(productId, req);

    }

    @Override
    public Product partialUpdate(Long productId, ProductRequest req) throws ProductException {

        System.out.println("partialUpdate method triggered");

        // Delegate to the existing update logic (reuse updateProduct logic)
        return updateProduct(productId, req);

    }

    public Product updateProduct(Long productId, ProductRequest req) throws ProductException {

        System.out.println("updateProduct method triggered");

        // Find the existing product
        Product product = findProductById(productId);

        boolean priceUpdated = false;
        boolean discountedPriceUpdated = false;
        boolean sizesUpdated = false;

        // Update fields dynamically using a map for non-primitive and non-collection types
        Map<Runnable, Boolean> updateActions = Map.of(
                () -> product.setDescription(req.getDescription()), req.getDescription() != null,
                () -> product.setFeatured(req.isFeatured()), req.isFeatured(),
                () -> product.setImageUrl(req.getImageUrl()), req.getImageUrl() != null && !req.getImageUrl().isEmpty(),
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
            sizesUpdated = true;

            // Update the total quantity using QuantityCalculatorUtil
            int updatedQuantity = QuantityCalculatorUtil.getTotalQuantity(product.getSizes());
            product.setQuantity(updatedQuantity);
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

        System.out.println("deleteProduct method triggered");

        Product product = findProductById(productId);
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product deleted Successfully";

    }

    @Override
    public Page<Product> getAllProducts(Integer pageNumber, Integer pageSize) {

        System.out.println("getAllProducts method triggered");

        // Find all products
        List<Product> products = productRepository.findAll();
        return PaginationUtil.paginateList(products, pageNumber, pageSize);

    }

    @Override
    public Product findProductById(Long id) throws ProductException {

        System.out.println("findProductById method triggered");

        Optional<Product> opt = productRepository.findById(id);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new ProductException("product not found with id " + id);
    }

    @Override
    public Page<Product> searchProduct(String query, Integer pageNumber, Integer pageSize) {

        System.out.println("searchProduct method triggered");

        // Search for products using the query
        List<Product> products = productRepository.searchProduct(query);
        return PaginationUtil.paginateList(products, pageNumber, pageSize);

    }

    @Override
    public Page<Product> searchProductByCategory(String category, Integer pageNumber, Integer pageSize) {

        System.out.println("searchProductByCategory method triggered");

        // Search for products using the query
        List<Product> products = productRepository.findProductsByCategoryName(category);
        return PaginationUtil.paginateList(products, pageNumber, pageSize);

    }

    @Override
    public Page<Product> getAllProduct(String query, List<String> colors,
                                       Integer minPrice, Integer maxPrice,
                                       Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize) {

        System.out.println("getAllProduct method triggered");

        // Filter products based on the provided parameters
        List<Product> products = productRepository.filterProducts(query, minPrice, maxPrice, minDiscount, sort);

        // Filter products based on colors
        if (!colors.isEmpty()) {
            products = products.stream()
                    .filter(p -> colors.stream().anyMatch(c -> c.equalsIgnoreCase(p.getColor())))
                    .collect(Collectors.toList());
        }

        // Filter products based on stock availability
        if (stock != null) {
            if (stock.equals("in_stock")) {
                products = products.stream().filter(p -> p.getQuantity() > 0).collect(Collectors.toList());
            } else if (stock.equals("out_of_stock")) {
                products = products.stream().filter(p -> p.getQuantity() < 1).collect(Collectors.toList());
            }
        }

        // Paginate the filtered products
        return PaginationUtil.paginateList(products, pageNumber, pageSize);
    }

//    @Override
//    public Page<Product> getAllProduct(String category, List<String> colors,
//                                       List<String> sizes, Integer minPrice, Integer maxPrice,
//                                       Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize) {
//
//        // Filter products based on the provided parameters
//        List<Product> products = productRepository.filterProducts(category, minPrice, maxPrice, minDiscount, sort);
//
//        // Filter products based on sizes
//        if (!colors.isEmpty()) {
//            products = products.stream()
//                    .filter(p -> colors.stream().anyMatch(c -> c.equalsIgnoreCase(p.getColor())))
//                    .collect(Collectors.toList());
//        }
//        if (stock != null) {
//            if (stock.equals("in_stock")) {
//                products = products.stream().filter(p -> p.getQuantity() > 0).collect(Collectors.toList());
//            } else if (stock.equals("out_of_stock")) {
//                products = products.stream().filter(p -> p.getQuantity() < 1).collect(Collectors.toList());
//            }
//        }
//
//        return PaginationUtil.paginateList(products, pageNumber, pageSize);
//
//    }

    @Override
    public Page<Product> searchProducts(String query, String category, String brand, String size,
                                        String color, Double minRating, Integer minPrice, Integer maxPrice,
                                        Integer discount, String sort, Integer pageNumber, Integer pageSize) throws ProductException {

        List<Product> products = productRepository.findAll();

        // Apply search query
        if (query != null && !query.isEmpty()) {
            String[] searchTerms = query.split(" ");
            log.info("Search terms: {}", Arrays.toString(searchTerms));

            products = products.stream()
                    .filter(product -> {
                        // Check if the product matches ALL of the search terms
                        for (String term : searchTerms) {
                            term = term.trim().toLowerCase(); // Normalize the term
                            log.info("Checking term: {}", term);

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
                    .collect(Collectors.toList());
        }

        // Apply filters
        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getCategory().getName().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (brand != null && !brand.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getBrand().equalsIgnoreCase(brand))
                    .collect(Collectors.toList());
        }

        if (size != null && !size.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getSizes().stream().anyMatch(s -> s.getName().toString().equalsIgnoreCase(size)))
                    .collect(Collectors.toList());
        }

        if (color != null && !color.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getColor().equalsIgnoreCase(color))
                    .collect(Collectors.toList());
        }

        if (minRating != null) {
            products = products.stream()
                    .filter(product -> product.getAverageRating() >= minRating)
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            products = products.stream()
                    .filter(product -> product.getPrice() >= minPrice)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            products = products.stream()
                    .filter(product -> product.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        if (discount != null) {
            products = products.stream()
                    .filter(product -> product.getDiscountPercent() >= discount)
                    .collect(Collectors.toList());
        }

        // Apply sorting
        if (sort != null && !sort.isEmpty()) {
            switch (sort.toLowerCase()) {
                case "price_asc":
                    products.sort((p1, p2) -> Integer.compare(p1.getPrice(), p2.getPrice()));
                    break;
                case "price_desc":
                    products.sort((p1, p2) -> Integer.compare(p2.getPrice(), p1.getPrice()));
                    break;
                case "rating":
                    products.sort((p1, p2) -> Double.compare(p2.getAverageRating(), p1.getAverageRating()));
                    break;
                case "discount":
                    products.sort((p1, p2) -> Integer.compare(p2.getDiscountPercent(), p1.getDiscountPercent()));
                    break;
                default:
                    // No sorting or default sorting
                    break;
            }
        }

        return Pagination1BasedUtil.paginateList(products, pageNumber, pageSize);

    }

}
