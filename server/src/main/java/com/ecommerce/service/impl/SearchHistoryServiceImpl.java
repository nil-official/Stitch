package com.ecommerce.service.impl;

import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.mapper.SearchHistoryMapper;
import com.ecommerce.model.SearchHistory;
import com.ecommerce.model.User;
import com.ecommerce.repository.SearchHistoryRepository;
import com.ecommerce.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchHistoryServiceImpl implements SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;

    @Override
    public List<SearchHistoryDto> fetchUserSearchHistory(User user) {
        List<SearchHistoryDto> searchHistory = SearchHistoryMapper.toDtoList(searchHistoryRepository.findByUserId(user.getId()));

        if (searchHistory.isEmpty()) {
            throw new RuntimeException("No search history found!");
        }

        return searchHistory;
    }

    @Override
    public void saveUserSearchPhrase(User user, String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            throw new RuntimeException("Phrase cannot be empty!");
        }

        String trimmedPhrase = phrase.trim();

        try {
            Optional<SearchHistory> existing = searchHistoryRepository
                    .findByUserIdAndPhraseIgnoreCase(user.getId(), trimmedPhrase);

            if (existing.isPresent()) {
                SearchHistory history = existing.get();
                history.setSearchedAt(LocalDateTime.now());
                searchHistoryRepository.save(history);
            } else {
                SearchHistory newHistory = new SearchHistory();
                newHistory.setPhrase(trimmedPhrase);
                newHistory.setSearchedAt(LocalDateTime.now());
                newHistory.setUser(user);
                searchHistoryRepository.save(newHistory);
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteUserSearchPhrase(User user, Long phraseId) {
        if (phraseId == null) {
            throw new RuntimeException("Phrase id cannot be empty!");
        }

        SearchHistory searchHistory = searchHistoryRepository.findById(phraseId)
                .orElseThrow(() -> new RuntimeException("Phrase not found!"));

        if (searchHistory.getUser().getId() != user.getId()) {
            throw new RuntimeException("Unauthorized: You are not allowed to delete this search phrase!");
        }

        try {
            searchHistoryRepository.delete(searchHistory);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void clearUserSearchPhrases(User user) {
        List<SearchHistory> searchHistories = searchHistoryRepository.findByUserId(user.getId());
        if (searchHistories.isEmpty()) {
            throw new RuntimeException("No search history found!");
        }

        try {
            searchHistoryRepository.deleteAllByUserId(user.getId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
