package com.ecommerce.mapper;

import com.ecommerce.dto.HomeProductDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.SearchDto;
import com.ecommerce.model.Product;
import com.ecommerce.model.ProductES;
import com.ecommerce.utility.SizeSortingUtil;

import java.util.List;
import java.util.stream.Collectors;

public class ProductMapper {

    public static ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountedPrice(product.getDiscountedPrice());
        dto.setDiscountPercent(product.getDiscountPercent());
        dto.setQuantity(product.getQuantity());
        dto.setBrand(product.getBrand());
        dto.setColor(product.getColor());
        dto.setPreview(product.getPreview());
        dto.setImages(product.getImages());
        dto.setSizes(SizeSortingUtil.sortSizes(product.getSizes()));
        dto.setAverageRating(product.getAverageRating());
        dto.setTotalReviews(product.getReviews() != null ? product.getReviews().size() : 0);
        dto.setRankScore(product.getRankScore());
        dto.setCategory(product.getCategory());
        return dto;
    }

    public static List<ProductDto> toDtoList(List<Product> products) {
        return products.stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    public static List<SearchDto> toSearchDtoList(List<Product> products) {
        return products.stream()
                .map(product -> {
                    SearchDto dto = new SearchDto();
                    dto.setId(product.getId());
                    dto.setTitle(product.getTitle());
                    dto.setPrice(product.getPrice());
                    dto.setDiscountedPrice(product.getDiscountedPrice());
                    dto.setDiscountPercent(product.getDiscountPercent());
                    dto.setQuantity(product.getQuantity());
                    dto.setBrand(product.getBrand());
                    dto.setPreview(product.getPreview());
                    dto.setAverageRating(product.getAverageRating());
                    dto.setRankScore(product.getRankScore());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public static List<HomeProductDto> toHomeProductDtoList(List<Product> products) {
        return products.stream()
                .map(product -> {
                    HomeProductDto dto = new HomeProductDto();
                    dto.setId(product.getId());
                    dto.setTitle(product.getTitle());
                    dto.setPrice(product.getPrice());
                    dto.setDiscountedPrice(product.getDiscountedPrice());
                    dto.setDiscountPercent(product.getDiscountPercent());
                    dto.setQuantity(product.getQuantity());
                    dto.setBrand(product.getBrand());
                    dto.setPreview(product.getPreview());
                    dto.setAverageRating(product.getAverageRating());
                    dto.setRankScore(product.getRankScore());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public static ProductES toProductES(Product product) {
        ProductES productES = new ProductES();
        productES.setId(product.getId());
        productES.setTitle(product.getTitle());
        return productES;
    }

}
