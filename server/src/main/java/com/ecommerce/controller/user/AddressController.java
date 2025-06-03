package com.ecommerce.controller.user;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.exception.AddressException;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.AddressService;
import com.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user/address")
public class AddressController {

    private final AddressService addressService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<AddressDto>> fetchUserAddressHandler(@RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        List<AddressDto> addresses = addressService.getAllAddresses(user);
        return new ResponseEntity<>(addresses, HttpStatus.OK);

    }

    @GetMapping("/{addressId}")
    public ResponseEntity<AddressDto> fetchUserAddressByIdHandler(@PathVariable Long addressId,
                                                                  @RequestHeader("Authorization") String jwt) throws UserException, AddressException {

        User user = userService.findUserProfileByJwt(jwt);
        AddressDto address = addressService.getAddressById(addressId, user);
        return new ResponseEntity<>(address, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<AddressDto> addUserAddressHandler(@Valid @RequestBody AddressDto addressDto,
                                                            @RequestHeader("Authorization") String jwt) throws UserException, AddressException {

        User user = userService.findUserProfileByJwt(jwt);
        AddressDto createdAddress = addressService.addAddress(addressDto, user);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);

    }

    @PatchMapping("/{addressId}")
    public ResponseEntity<AddressDto> updateUserAddressHandler(@PathVariable Long addressId, @RequestBody AddressDto addressDto,
                                                               @RequestHeader("Authorization") String jwt) throws UserException, AddressException {

        User user = userService.findUserProfileByJwt(jwt);
        AddressDto updatedAddress = addressService.updateAddress(addressId, addressDto, user);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);

    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse> deleteUserAddressHandler(@PathVariable Long addressId,
                                                                @RequestHeader("Authorization") String jwt) throws UserException, AddressException {

        User user = userService.findUserProfileByJwt(jwt);
        addressService.deleteAddress(addressId, user);
        return new ResponseEntity<>(new ApiResponse("Address deleted successfully.", true), HttpStatus.OK);

    }

}
