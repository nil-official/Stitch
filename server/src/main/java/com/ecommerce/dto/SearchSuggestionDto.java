package com.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchSuggestionDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    private String suggestion;
    private String type;

}
