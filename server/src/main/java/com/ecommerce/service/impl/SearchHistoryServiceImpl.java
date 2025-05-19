package com.ecommerce.service.impl;

import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.dto.SearchSuggestionDto;
import com.ecommerce.enums.SearchHistoryCodes;
import com.ecommerce.exception.SearchHistoryException;
import com.ecommerce.mapper.SearchHistoryMapper;
import com.ecommerce.model.SearchHistory;
import com.ecommerce.model.User;
import com.ecommerce.repository.SearchHistoryRepository;
import com.ecommerce.service.ProductESService;
import com.ecommerce.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchHistoryServiceImpl implements SearchHistoryService {

    private final ProductESService productESService;
    private final SearchHistoryRepository searchHistoryRepository;

    @Override
    public List<SearchSuggestionDto> fetchSearchSuggestions(User user, String query) throws IOException {
        String normalizedQuery = query.trim().toLowerCase();

        // History suggestions (prioritized)
        List<SearchSuggestionDto> historySuggestions = fetchUserSearchHistory(user).stream()
                .filter(dto -> dto.getPhrase() != null && dto.getPhrase().toLowerCase().startsWith(normalizedQuery))
                .map(dto -> new SearchSuggestionDto(dto.getId(), dto.getPhrase().toLowerCase(), "history"))
                .distinct()
                .toList();

        Set<String> historySet = historySuggestions.stream()
                .map(SearchSuggestionDto::getSuggestion)
                .collect(Collectors.toSet());

        // ElasticSearch suggestions
        List<SearchSuggestionDto> elasticSuggestions = productESService.autocompleteSearch(query).stream()
                .map(String::toLowerCase)
                .filter(suggestion -> !historySet.contains(suggestion)) // avoid duplicates
                .distinct()
                .map(suggestion -> new SearchSuggestionDto(null, suggestion, "suggestion"))
                .toList();

        // Combine: history first, then elastic suggestions
        List<SearchSuggestionDto> combined = new ArrayList<>();
        combined.addAll(historySuggestions);
        combined.addAll(elasticSuggestions);

        return combined.stream()
                .limit(10)
                .toList();
    }

    @Override
    public List<SearchHistoryDto> fetchUserSearchHistory(User user) {
        return SearchHistoryMapper.toDtoList(searchHistoryRepository.findByUserId(user.getId()))
                .stream()
                .limit(10)
                .toList();
    }

    @Override
    public List<SearchHistoryDto> fetchSearchAutocomplete(String query) throws IOException {
        return SearchHistoryMapper.EStoDtoList(productESService.autocompleteSearch(query));
    }

    @Override
    public SearchHistoryDto saveUserSearchPhrase(User user, String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            throw new SearchHistoryException(SearchHistoryCodes.EMPTY_PHRASE, HttpStatus.BAD_REQUEST);
        }

        String trimmedPhrase = phrase.toLowerCase().trim();

        try {
            Optional<SearchHistory> existing = searchHistoryRepository
                    .findByUserIdAndPhraseIgnoreCase(user.getId(), trimmedPhrase);

            SearchHistory history = existing.map(h -> {
                h.setSearchedAt(LocalDateTime.now());
                return h;
            }).orElseGet(() -> {
                SearchHistory newHistory = new SearchHistory();
                newHistory.setPhrase(trimmedPhrase);
                newHistory.setSearchedAt(LocalDateTime.now());
                newHistory.setUser(user);
                return newHistory;
            });

            return SearchHistoryMapper.toDto(searchHistoryRepository.save(history));

        } catch (Exception e) {
            throw new SearchHistoryException(SearchHistoryCodes.SAVE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteUserSearchPhrase(User user, Long phraseId) {
        if (phraseId == null || phraseId <= 0) {
            throw new SearchHistoryException(SearchHistoryCodes.INVALID_IDENTIFIER, HttpStatus.BAD_REQUEST);
        }

        SearchHistory searchHistory = searchHistoryRepository.findById(phraseId)
                .orElseThrow(() -> new SearchHistoryException(SearchHistoryCodes.NOT_FOUND, HttpStatus.NOT_FOUND));

        if (!searchHistory.getUser().getId().equals(user.getId())) {
            throw new SearchHistoryException(SearchHistoryCodes.UNAUTHORIZED_ACCESS, HttpStatus.FORBIDDEN);
        }

        try {
            searchHistoryRepository.delete(searchHistory);
        } catch (Exception e) {
            throw new SearchHistoryException(SearchHistoryCodes.DELETE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public void clearUserSearchPhrases(User user) {
        List<SearchHistory> searchHistories = searchHistoryRepository.findByUserId(user.getId());

        try {
            searchHistoryRepository.deleteAllByUserId(user.getId());
        } catch (Exception e) {
            throw new SearchHistoryException(SearchHistoryCodes.CLEAR_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
