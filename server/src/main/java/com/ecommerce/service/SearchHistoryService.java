package com.ecommerce.service;

import com.ecommerce.dto.SearchSuggestionDto;
import com.ecommerce.model.User;
import com.ecommerce.dto.SearchHistoryDto;

import java.util.List;

public interface SearchHistoryService {

    List<SearchSuggestionDto> fetchSearchSuggestions(User user, String query) throws Exception;

    List<SearchHistoryDto> fetchUserSearchHistory(User user);

    List<SearchHistoryDto> fetchSearchAutocomplete(String query) throws Exception;

    SearchHistoryDto saveUserSearchPhrase(User user, String phrase);

    void deleteUserSearchPhrase(User user, Long phraseId);

    void clearUserSearchPhrases(User user);

}
