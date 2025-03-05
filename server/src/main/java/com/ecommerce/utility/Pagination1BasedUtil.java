package com.ecommerce.utility;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class Pagination1BasedUtil {

    public static <T> Page<T> paginateList(List<T> items, int pageNumber, int pageSize) {
        if (items == null) {
            throw new IllegalArgumentException("Items must not be null");
        }
        if (pageNumber < 1 || pageSize <= 0) { // Page number should start from 1
            throw new IllegalArgumentException("Page number must be at least 1 and page size must be greater than 0");
        }

        int adjustedPageNumber = pageNumber - 1; // Convert to zero-based index
        Pageable pageable = PageRequest.of(adjustedPageNumber, pageSize);
        int startIndex = (int) pageable.getOffset();
        int endIndex = Math.min(startIndex + pageable.getPageSize(), items.size());

        if (startIndex > items.size()) {
            return new PageImpl<>(List.of(), pageable, items.size());
        }

        List<T> pageContent = items.subList(startIndex, endIndex);
        return new PageImpl<>(pageContent, pageable, items.size());
    }

}
