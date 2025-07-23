package com.ecommerce.mapper;

import com.ecommerce.dto.UserAuthDto;
import com.ecommerce.dto.UserProfileDto;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.dto.UserDto;

import java.util.stream.Collectors;

public class UserMapper {
    public static UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setRoles(user.getRoles());
        userDto.setMobile(user.getMobile());
        userDto.setDob(user.getDob());
        userDto.setTotalAddresses(user.getAddresses() != null ? user.getAddresses().size() : 0);
        userDto.setTotalOrders(user.getOrders() != null ? user.getOrders().size() : 0);
        if (user.getWishlists() != null) {
            int totalWishlistItems = user.getWishlists().stream()
                    .mapToInt(wishlist -> wishlist.getWishlistItems().size())
                    .sum();
            userDto.setTotalWishlists(totalWishlistItems);
        } else {
            userDto.setTotalWishlists(0);
        }
        userDto.setCreatedAt(user.getCreatedAt());
        return userDto;
    }

    public static UserAuthDto toUserAuthDto(User user) {
        return new UserAuthDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getMobile(),
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.joining(", "))
        );
    }

    public static UserProfileDto toUserProfileDto(User user) {
        UserProfileDto userProfileDto = new UserProfileDto();
        userProfileDto.setId(user.getId());
        userProfileDto.setFirstName(user.getFirstName());
        userProfileDto.setLastName(user.getLastName());
        userProfileDto.setEmail(user.getEmail());
        userProfileDto.setMobile(user.getMobile());
        userProfileDto.setDob(user.getDob());
        userProfileDto.setGender(user.getGender());
        userProfileDto.setAge(user.getAge());
        userProfileDto.setHeight(user.getHeight());
        userProfileDto.setWeight(user.getWeight());
        userProfileDto.setPredictedSizes(user.getPredictedSizes());
        userProfileDto.setCreatedAt(user.getCreatedAt());
        return userProfileDto;
    }

    public static void updateUser(User existingUserData, UserDto updatedUserData) {
        if (updatedUserData.getFirstName() != null) {
            existingUserData.setFirstName(updatedUserData.getFirstName());
        }
        if (updatedUserData.getLastName() != null) {
            existingUserData.setLastName(updatedUserData.getLastName());
        }
        if (updatedUserData.getEmail() != null) {
            existingUserData.setEmail(updatedUserData.getEmail());
        }
        if (updatedUserData.getMobile() != null) {
            existingUserData.setMobile(updatedUserData.getMobile());
        }
        if (updatedUserData.getDob() != null) {
            existingUserData.setDob(updatedUserData.getDob());
        }
    }
}