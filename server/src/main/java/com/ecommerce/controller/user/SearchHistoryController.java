package com.ecommerce.controller.user;

import com.ecommerce.annotation.CurrentUser;
import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.dto.SearchSuggestionDto;
import com.ecommerce.model.User;
import com.ecommerce.response.ResponseBuilder;
import com.ecommerce.response.SuccessResponse;
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
    public ResponseEntity<SuccessResponse<List<SearchSuggestionDto>>> fetchSearchSuggestions(@CurrentUser User user,
                                                                                             @RequestParam String query) throws Exception {

        List<SearchSuggestionDto> searchSuggestions = searchHistoryService.fetchSearchSuggestions(user, query);
        return new ResponseEntity<>(ResponseBuilder.success("Search suggestions fetched successfully.", searchSuggestions), HttpStatus.OK);

    }

    @GetMapping("/history")
    public ResponseEntity<SuccessResponse<List<SearchHistoryDto>>> fetchSearchHistory(@CurrentUser User user) {

        List<SearchHistoryDto> searchHistory = searchHistoryService.fetchUserSearchHistory(user);
        return new ResponseEntity<>(ResponseBuilder.success("Search history fetched successfully.", searchHistory), HttpStatus.OK);

    }

    @GetMapping("/autocomplete")
    public ResponseEntity<SuccessResponse<List<SearchHistoryDto>>> fetchSearchAutocomplete(@RequestParam String query) throws Exception {

        List<SearchHistoryDto> searchHistory = searchHistoryService.fetchSearchAutocomplete(query);
        return new ResponseEntity<>(ResponseBuilder.success("Autocomplete fetched successfully.", searchHistory), HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<SuccessResponse<SearchHistoryDto>> saveSearchHistory(@CurrentUser User user, @RequestParam String phrase) {

        SearchHistoryDto saved = searchHistoryService.saveUserSearchPhrase(user, phrase);
        return new ResponseEntity<>(ResponseBuilder.success("Search phrase saved successfully.", saved), HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<SuccessResponse<?>> deleteSearchHistory(@CurrentUser User user, @RequestParam Long phraseId) {

        searchHistoryService.deleteUserSearchPhrase(user, phraseId);
        return new ResponseEntity<>(ResponseBuilder.successMessage("Search phrase deleted successfully."), HttpStatus.OK);

    }

    @DeleteMapping("/clear")
    public ResponseEntity<SuccessResponse<?>> clearSearchHistory(@CurrentUser User user) {

        searchHistoryService.clearUserSearchPhrases(user);
        return new ResponseEntity<>(ResponseBuilder.successMessage("Search phrases cleared successfully."), HttpStatus.OK);

    }

}
