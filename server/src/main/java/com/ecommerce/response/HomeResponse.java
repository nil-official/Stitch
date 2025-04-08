package com.ecommerce.response;

import com.ecommerce.dto.HomeProductDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeResponse {

    private Page<HomeProductDto> featuredProducts;
    private Page<HomeProductDto> discountedProducts;
    private Page<HomeProductDto> newArrivals;
    private Page<HomeProductDto> topRatedProducts;
    private Page<HomeProductDto> bestSellerProducts;

}
