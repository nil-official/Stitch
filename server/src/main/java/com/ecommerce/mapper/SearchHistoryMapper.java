package com.ecommerce.mapper;

import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.model.SearchHistory;

import java.util.List;
import java.util.stream.Collectors;

public class SearchHistoryMapper {

    public static SearchHistoryDto toDto(SearchHistory searchHistory) {
        SearchHistoryDto searchHistoryDto = new SearchHistoryDto();
        searchHistoryDto.setId(searchHistory.getId());
        searchHistoryDto.setPhrase(searchHistory.getPhrase());
        searchHistoryDto.setSearchedAt(searchHistory.getSearchedAt());
        return searchHistoryDto;
    }

    public static List<SearchHistoryDto> toDtoList(List<SearchHistory> searchHistoryList) {
        return searchHistoryList.stream()
                .sorted((a, b) -> b.getSearchedAt().compareTo(a.getSearchedAt()))
                .map(SearchHistoryMapper::toDto)
                .collect(Collectors.toList());
    }

}
