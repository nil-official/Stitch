package com.ecommerce.service;

import com.ecommerce.dto.SearchSuggestionDto;
import com.ecommerce.model.User;
import com.ecommerce.dto.SearchHistoryDto;

import java.io.IOException;
import java.util.List;

public interface SearchHistoryService {

    List<SearchSuggestionDto> fetchSearchSuggestions(User user, String query) throws IOException;

    List<SearchHistoryDto> fetchUserSearchHistory(User user);

    List<SearchHistoryDto> fetchSearchAutocomplete(String query) throws IOException;

    SearchHistoryDto saveUserSearchPhrase(User user, String phrase);

    void deleteUserSearchPhrase(User user, Long phraseId);

    void clearUserSearchPhrases(User user);

}
