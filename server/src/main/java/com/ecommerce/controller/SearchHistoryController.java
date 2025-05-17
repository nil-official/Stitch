package com.ecommerce.controller;

import com.ecommerce.annotation.CurrentUser;
import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.model.User;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.SearchHistoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user/search")
public class SearchHistoryController {

    private final SearchHistoryService searchHistoryService;

    @GetMapping
    public ResponseEntity<List<SearchHistoryDto>> fetchSearch(@CurrentUser User user) {

        List<SearchHistoryDto> searchHistory = searchHistoryService.fetchUserSearchHistory(user);
        return new ResponseEntity<>(searchHistory, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<ApiResponse> saveSearch(@CurrentUser User user, @RequestParam String phrase) {

        searchHistoryService.saveUserSearchPhrase(user, phrase);
        ApiResponse apiResponse = new ApiResponse("Search phrase saved successfully.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteSearch(@CurrentUser User user, @RequestParam Long phraseId) {

        searchHistoryService.deleteUserSearchPhrase(user, phraseId);
        ApiResponse apiResponse = new ApiResponse("Search phrase deleted successfully.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearSearch(@CurrentUser User user) {

        searchHistoryService.clearUserSearchPhrases(user);
        ApiResponse apiResponse = new ApiResponse("Search phrases cleared successfully.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

}
