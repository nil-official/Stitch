package com.ecommerce.model;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "products")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductES {

    private Long id;
    private String title;
    private String description;
    private int price;
    private String brand;
    private String color;

}
