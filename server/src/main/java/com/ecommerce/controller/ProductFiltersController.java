package com.ecommerce.controller;

import com.ecommerce.service.ProductFiltersService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class ProductFiltersController {

    private final ProductFiltersService productFiltersService;

    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getProductFilters(@RequestParam(required = false) String query) {

        Map<String, Object> filters = productFiltersService.getProductFilters(query);
        return new ResponseEntity<>(filters, HttpStatus.OK);

    }

}
