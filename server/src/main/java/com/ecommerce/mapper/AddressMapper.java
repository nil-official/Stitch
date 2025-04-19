package com.ecommerce.mapper;

import com.ecommerce.model.Address;
import com.ecommerce.dto.AddressDto;

import java.util.List;
import java.util.stream.Collectors;

public class AddressMapper {

    public static Address toAddress(AddressDto addressDto) {
        Address address = new Address();
        address.setId(addressDto.getId());
        address.setFirstName(addressDto.getFirstName());
        address.setLastName(addressDto.getLastName());
        address.setStreetAddress(addressDto.getStreetAddress());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setZipCode(addressDto.getZipCode());
        address.setMobile(addressDto.getMobile());
        return address;
    }

    public static AddressDto toAddressDto(Address address) {
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setFirstName(address.getFirstName());
        addressDto.setLastName(address.getLastName());
        addressDto.setStreetAddress(address.getStreetAddress());
        addressDto.setCity(address.getCity());
        addressDto.setState(address.getState());
        addressDto.setZipCode(address.getZipCode());
        addressDto.setMobile(address.getMobile());
        addressDto.setType(address.getType().toString());
        addressDto.setIsDefault(address.isDefault());
        addressDto.setCreatedAt(address.getCreatedAt());
        return addressDto;
    }

    public static List<AddressDto> toAddressDtoList(List<Address> addresses) {
        return addresses.stream()
                .map(AddressMapper::toAddressDto)
                .collect(Collectors.toList());
    }

}
