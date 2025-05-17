package com.ecommerce.service.impl;

import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.exception.SearchHistoryException;
import com.ecommerce.mapper.SearchHistoryMapper;
import com.ecommerce.model.SearchHistory;
import com.ecommerce.model.User;
import com.ecommerce.repository.SearchHistoryRepository;
import com.ecommerce.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SearchHistoryServiceImpl implements SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;

    @Override
    public List<SearchHistoryDto> fetchUserSearchHistory(User user) {
        try {
            List<SearchHistoryDto> searchHistory = SearchHistoryMapper.toDtoList(searchHistoryRepository.findByUserId(user.getId()));

            if (searchHistory.isEmpty()) {
                throw new SearchHistoryException("No search history found for the user " + user.getEmail(), HttpStatus.NO_CONTENT);
            }

            return searchHistory;
        } catch (SearchHistoryException e) {
            throw e;
        } catch (Exception e) {
            throw new SearchHistoryException("An unexpected error occurred while fetching search history.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void saveUserSearchPhrase(User user, String phrase) {
        if (phrase == null || phrase.trim().isEmpty()) {
            throw new SearchHistoryException("Search phrase cannot be null or empty.", HttpStatus.BAD_REQUEST);
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
        } catch (SearchHistoryException e) {
            throw e;
        } catch (Exception e) {
            throw new SearchHistoryException("Internal server error while saving search phrase.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteUserSearchPhrase(User user, Long phraseId) {
        if (phraseId == null || phraseId <= 0) {
            throw new SearchHistoryException("Phrase ID must be a positive number.", HttpStatus.BAD_REQUEST);
        }

        SearchHistory searchHistory = searchHistoryRepository.findById(phraseId)
                .orElseThrow(() -> new SearchHistoryException("Search phrase not found with ID: " + phraseId, HttpStatus.NOT_FOUND));

        if (!searchHistory.getUser().getId().equals(user.getId())) {
            throw new SearchHistoryException("Unauthorized: You do not have permission to delete this phrase.", HttpStatus.FORBIDDEN);
        }

        try {
            searchHistoryRepository.delete(searchHistory);
        } catch (SearchHistoryException e) {
            throw e;
        } catch (Exception e) {
            throw new SearchHistoryException("Internal server error while deleting search phrase.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public void clearUserSearchPhrases(User user) {
        List<SearchHistory> searchHistories = searchHistoryRepository.findByUserId(user.getId());

        if (searchHistories.isEmpty()) {
            throw new SearchHistoryException("No search history found for user: " + user.getEmail(), HttpStatus.NO_CONTENT);
        }

        try {
            searchHistoryRepository.deleteAllByUserId(user.getId());
        } catch (SearchHistoryException e) {
            throw e;
        } catch (Exception e) {
            throw new SearchHistoryException("Internal server error while clearing search history.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
