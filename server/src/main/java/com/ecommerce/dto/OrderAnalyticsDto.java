package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderAnalyticsDto {
    private List<AnalyticsDataDto> daily;
    private List<AnalyticsDataDto> weekly;
    private List<AnalyticsDataDto> monthly;
}
