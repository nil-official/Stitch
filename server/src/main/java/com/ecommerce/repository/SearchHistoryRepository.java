package com.ecommerce.repository;

import com.ecommerce.model.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    List<SearchHistory> findByUserId(Long userId);

    Optional<SearchHistory> findByUserIdAndPhraseIgnoreCase(Long userId, String phrase);

    void deleteAllByUserId(Long userId);

}
