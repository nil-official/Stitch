package com.ecommerce.repository;

import com.ecommerce.model.ProductES;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ProductESRepository extends ElasticsearchRepository<ProductES, Long> {
}
