package com.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchHistoryDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    private String phrase;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LocalDateTime searchedAt;

}
