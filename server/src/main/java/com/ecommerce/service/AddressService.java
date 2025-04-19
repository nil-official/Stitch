package com.ecommerce.service;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.exception.AddressException;
import com.ecommerce.model.User;

import java.util.List;

public interface AddressService {

    List<AddressDto> getAllAddresses(User user);

    AddressDto getAddressById(Long addressId, User user) throws AddressException;

    AddressDto addAddress(AddressDto addressDto, User user) throws AddressException;

    AddressDto updateAddress(Long addressId, AddressDto addressDto, User user) throws AddressException;

    void deleteAddress(Long addressId, User user) throws AddressException;

}
