package com.ecommerce.service.impl;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.Size;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductFiltersService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class ProductFiltersServiceImpl implements ProductFiltersService {

    private final ProductRepository productRepository;

    @Override
    public Map<String, Object> getProductFilters(String query) {
        List<Product> products = productRepository.findAll();

        if (query != null && !query.isEmpty()) {
            String[] searchTerms = query.toLowerCase().split(" ");

            products = products.stream()
                    .filter(product -> Arrays.stream(searchTerms)
                            .allMatch(term -> product.getTitle().toLowerCase().contains(term) ||
                                    product.getDescription().toLowerCase().contains(term) ||
                                    product.getBrand().toLowerCase().contains(term) ||
                                    product.getColor().toLowerCase().contains(term) ||
                                    matchesCategoryHierarchy(product.getCategory(), term)))
                    .collect(Collectors.toList());
        }

        Map<String, Object> filters = new LinkedHashMap<>();

        // Get price range
        int minPrice = products.stream().mapToInt(Product::getDiscountedPrice).min().orElse(0);
        int maxPrice = products.stream().mapToInt(Product::getDiscountedPrice).max().orElse(0);

        // Filters response
        filters.put("price", Map.of("minPrice", minPrice, "maxPrice", maxPrice));
        filters.put("category", getCategoryCounts(products));
        filters.put("brand", getCounts(products, Product::getBrand));
        filters.put("size", getSizeCounts(products));
        filters.put("color", getCounts(products, Product::getColor));
        filters.put("discount", getDiscountCounts(products));
        filters.put("rating", getRatingCounts(products));

        return filters;
    }

    private boolean matchesCategoryHierarchy(Category category, String term) {
        while (category != null) {
            if (category.getName().toLowerCase().contains(term)) {
                return true;
            }
            category = category.getParentCategory();
        }
        return false;
    }

    private List<Map<String, Object>> getCategoryCounts(List<Product> products) {
        return products.stream()
                .collect(Collectors.groupingBy(p -> p.getCategory().getName(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> Map.of("name", entry.getKey(), "count", (Object) entry.getValue()))
                .sorted(Comparator.comparing(map -> (String) map.get("name"))) // Sort Alphabetically
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getCounts(List<Product> products, java.util.function.Function<Product, String> mapper) {
        return products.stream()
                .collect(Collectors.groupingBy(mapper, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> Map.of("name", entry.getKey(), "count", (Object) entry.getValue()))
                .sorted(Comparator.comparing(map -> (String) map.get("name"))) // Sort Alphabetically
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getDiscountCounts(List<Product> products) {
        Map<Integer, Long> discountCounts = new HashMap<>();

        discountCounts.put(5, products.stream().filter(p -> p.getDiscountPercent() >= 5).count());
        discountCounts.put(10, products.stream().filter(p -> p.getDiscountPercent() >= 10).count());
        discountCounts.put(25, products.stream().filter(p -> p.getDiscountPercent() >= 25).count());
        discountCounts.put(50, products.stream().filter(p -> p.getDiscountPercent() >= 50).count());
        discountCounts.put(75, products.stream().filter(p -> p.getDiscountPercent() >= 75).count());
        discountCounts.put(90, products.stream().filter(p -> p.getDiscountPercent() >= 90).count());

        return discountCounts.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .map(entry -> Map.of("name", (Object) entry.getKey(), "count", (Object) entry.getValue()))
                .sorted(Comparator.comparingInt(map -> (Integer) map.get("name")))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getRatingCounts(List<Product> products) {
        Map<Integer, Long> ratingCounts = new HashMap<>();

        ratingCounts.put(1, products.stream().filter(p -> p.getAverageRating() >= 1).count());
        ratingCounts.put(2, products.stream().filter(p -> p.getAverageRating() >= 2).count());
        ratingCounts.put(3, products.stream().filter(p -> p.getAverageRating() >= 3).count());
        ratingCounts.put(4, products.stream().filter(p -> p.getAverageRating() >= 4).count());

        return ratingCounts.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .map(entry -> Map.of("name", (Object) entry.getKey(), "count", (Object) entry.getValue()))
                .sorted(Comparator.comparingInt(map -> (Integer) map.get("name")))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getSizeCounts(List<Product> products) {
        List<String> sizeOrder = List.of(
                "XS", "S", "M", "L", "XL", "XXL",
                "28", "30", "32", "34", "36", "38", "40"
        );

        return products.stream()
                .flatMap(product -> product.getSizes().stream()) // Flatten sizes
                .collect(Collectors.groupingBy(Size::getName, Collectors.counting())) // Get ProductSize name
                .entrySet().stream()
                .map(entry -> Map.of("name", entry.getKey(), "count", (Object) entry.getValue()))
                .sorted(Comparator.comparingInt(map -> sizeOrder.indexOf(map.get("name")))) // Sort by predefined order
                .collect(Collectors.toList());
    }

}
