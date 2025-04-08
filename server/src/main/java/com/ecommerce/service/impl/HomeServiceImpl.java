package com.ecommerce.service.impl;

import com.ecommerce.dto.HomeProductDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.mapper.ProductMapper;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.response.HomeResponse;
import com.ecommerce.service.HomeService;
import com.ecommerce.utility.Pagination1BasedUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public HomeResponse getHomeProducts(Integer pageNumber, Integer pageSize) throws ProductException {
        try {
            return new HomeResponse(
                    mapAndPaginate(fetchFeatured(), pageNumber, pageSize),
                    mapAndPaginate(fetchDiscounted(), pageNumber, pageSize),
                    mapAndPaginate(fetchNewArrival(), pageNumber, pageSize),
                    mapAndPaginate(fetchTopRated(), pageNumber, pageSize),
                    mapAndPaginate(fetchBestSeller(), pageNumber, pageSize)
            );
        } catch (Exception e) {
            throw new ProductException("Error while fetching home products: " + e.getMessage());
        }
    }

    private Page<HomeProductDto> mapAndPaginate(List<Product> products, int pageNumber, int pageSize) {
        return Pagination1BasedUtil.paginateList(
                ProductMapper.toHomeProductDtoList(products),
                pageNumber,
                pageSize
        );
    }

    private List<Product> fetchFeatured() {
        // Get all products that are featured
        return productRepository.findByIsFeaturedTrue();
    }

    private List<Product> fetchDiscounted() {
        // Get all products oder by discountPercent desc
        return productRepository.findAllByOrderByDiscountPercentDesc();
    }

    private List<Product> fetchNewArrival() {
        // Get all products and filter by createdAt in the last 7 days, then sort by createdAt desc
        return productRepository.findAll().stream()
                .filter(product -> product.getCreatedAt() != null && product.getCreatedAt().isAfter(LocalDateTime.now().minusWeeks(1)))
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    private List<Product> fetchTopRated() {
        // Filter those that have at least one review
        return productRepository.findAll().stream()
                .filter(product -> product.getReviews() != null && !product.getReviews().isEmpty())
                .sorted(Comparator
                        .comparingDouble(Product::getAverageRating).reversed()
                        .thenComparing((p) -> p.getReviews().size(), Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    private List<Product> fetchBestSeller() {
        // Get all products that are best-selling
        return orderItemRepository.findBestSellerProducts()
                .stream()
                .map(result -> (Product) result[0])
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getFeaturedProducts() throws ProductException {
        try {
            return ProductMapper.toDtoList(fetchFeatured());
        } catch (Exception e) {
            throw new ProductException("Error while fetching featured products: " + e.getMessage());
        }
    }

    @Override
    public List<ProductDto> getExclusiveDiscounts() throws ProductException {
        try {
            return ProductMapper.toDtoList(fetchDiscounted());
        } catch (Exception e) {
            throw new ProductException("Error while fetching discounted products: " + e.getMessage());
        }
    }

    @Override
    public List<ProductDto> getNewArrivals() throws ProductException {
        try {
            return ProductMapper.toDtoList(fetchNewArrival());
        } catch (Exception e) {
            throw new ProductException("Error while fetching new arrivals: " + e.getMessage());
        }
    }

    @Override
    public List<ProductDto> getTopRatedProducts() throws ProductException {
        try {
            return ProductMapper.toDtoList(fetchTopRated());
        } catch (Exception e) {
            throw new ProductException("Error while fetching top rated products: " + e.getMessage());
        }
    }

    @Override
    public List<ProductDto> getBestSellerProducts() throws ProductException {
        try {
            return ProductMapper.toDtoList(fetchBestSeller());
        } catch (Exception e) {
            throw new ProductException("Error while fetching best seller products: " + e.getMessage());
        }
    }

}
