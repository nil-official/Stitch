package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.dto.SearchHistoryDto;

import java.util.List;

public interface SearchHistoryService {

    List<SearchHistoryDto> fetchUserSearchHistory(User user);

    void saveUserSearchPhrase(User user, String phrase);

    void deleteUserSearchPhrase(User user, Long phraseId);

    void clearUserSearchPhrases(User user);

}
