package com.ecommerce.controller;

import com.ecommerce.dto.SearchHistoryDto;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.SearchHistoryService;
import com.ecommerce.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user/search")
public class SearchHistoryController {

    private final UserService userService;
    private final SearchHistoryService searchHistoryService;

    @GetMapping
    public ResponseEntity<List<SearchHistoryDto>> fetchSearch(@RequestHeader("Authorization") String jwt)
            throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        List<SearchHistoryDto> searchHistory = searchHistoryService.fetchUserSearchHistory(user);
        return new ResponseEntity<>(searchHistory, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<ApiResponse> saveSearch(@RequestHeader("Authorization") String jwt,
                                                  @RequestParam String phrase) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        searchHistoryService.saveUserSearchPhrase(user, phrase);
        ApiResponse apiResponse = new ApiResponse("Search phrase saved successfully.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteSearch(@RequestHeader("Authorization") String jwt,
                                                    @RequestParam Long phraseId) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        searchHistoryService.deleteUserSearchPhrase(user, phraseId);
        ApiResponse apiResponse = new ApiResponse("Search phrase deleted successfully.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearSearch(@RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        searchHistoryService.clearUserSearchPhrases(user);
        ApiResponse apiResponse = new ApiResponse("Search phrases cleared successfully.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

}
