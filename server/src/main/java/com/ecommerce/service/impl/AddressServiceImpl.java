package com.ecommerce.service.impl;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.exception.AddressException;
import com.ecommerce.mapper.AddressMapper;
import com.ecommerce.model.Address;
import com.ecommerce.model.User;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.service.AddressService;
import com.ecommerce.enums.AddressType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Override
    public List<AddressDto> getAllAddresses(User user) {
        List<Address> addresses = addressRepository.findByUser(user);

        List<Address> sortedAddresses = addresses.stream()
                .sorted((a1, a2) -> {
                    if (a1.isDefault() && !a2.isDefault()) return -1;
                    if (!a1.isDefault() && a2.isDefault()) return 1;
                    return a1.getCreatedAt().compareTo(a2.getCreatedAt());
                })
                .toList();

        return AddressMapper.toAddressDtoList(sortedAddresses);
    }

    @Override
    public AddressDto getAddressById(Long addressId, User user) throws AddressException {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new AddressException("Unauthorized to access this address");
        }

        return AddressMapper.toAddressDto(address);
    }

    @Override
    @Transactional
    public AddressDto addAddress(AddressDto addressDto, User user) throws AddressException {
        // Default to HOME if type is not provided
        AddressType addressType;
        try {
            String typeInput = addressDto.getType();
            addressType = (typeInput == null || typeInput.isBlank())
                    ? AddressType.HOME
                    : AddressType.valueOf(typeInput.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AddressException("Invalid address type. Only 'Home' or 'Office' allowed.");
        }

        // Create Address entity
        Address address = AddressMapper.toAddress(addressDto);
        address.setUser(user);
        address.setType(addressType);
        address.setCreatedAt(LocalDateTime.now());

        // If isDefault is not provided, default to false
        boolean isDefault = addressDto.getIsDefault() != null && addressDto.getIsDefault();
        if (isDefault) {
            // Unset other default addresses for this user
            List<Address> userAddresses = addressRepository.findByUser(user);
            for (Address a : userAddresses) {
                if (a.isDefault()) {
                    a.setDefault(false);
                    addressRepository.save(a);
                }
            }
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }

        Address savedAddress = addressRepository.save(address);
        return AddressMapper.toAddressDto(savedAddress);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(Long addressId, AddressDto addressDto, User user) throws AddressException {
        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressException("Address not found with ID: " + addressId));

        // Ensure the address belongs to the logged-in user
        if (!existingAddress.getUser().getId().equals(user.getId())) {
            throw new AddressException("You are not authorized to update this address.");
        }

        // Update only the fields that are provided
        if (addressDto.getFirstName() != null && !addressDto.getFirstName().isBlank()) {
            existingAddress.setFirstName(addressDto.getFirstName());
        }
        if (addressDto.getLastName() != null && !addressDto.getLastName().isBlank()) {
            existingAddress.setLastName(addressDto.getLastName());
        }
        if (addressDto.getStreetAddress() != null && !addressDto.getStreetAddress().isBlank()) {
            existingAddress.setStreetAddress(addressDto.getStreetAddress());
        }
        if (addressDto.getCity() != null && !addressDto.getCity().isBlank()) {
            existingAddress.setCity(addressDto.getCity());
        }
        if (addressDto.getState() != null && !addressDto.getState().isBlank()) {
            existingAddress.setState(addressDto.getState());
        }
        if (addressDto.getZipCode() != null && !addressDto.getZipCode().isBlank()) {
            existingAddress.setZipCode(addressDto.getZipCode());
        }
        if (addressDto.getMobile() != null && !addressDto.getMobile().isBlank()) {
            existingAddress.setMobile(addressDto.getMobile());
        }

        // Handle address type if provided
        if (addressDto.getType() != null && !addressDto.getType().isBlank()) {
            try {
                AddressType addressType = AddressType.valueOf(addressDto.getType().toUpperCase());
                existingAddress.setType(addressType);
            } catch (IllegalArgumentException e) {
                throw new AddressException("Invalid address type. Only 'Home' or 'Office' allowed.");
            }
        }

        // Handle isDefault if explicitly provided
        if (addressDto.getIsDefault() != null) {
            if (addressDto.getIsDefault()) {
                // Set all other addresses to non-default
                List<Address> userAddresses = addressRepository.findByUser(user);
                for (Address addr : userAddresses) {
                    if (!addr.getId().equals(existingAddress.getId()) && addr.isDefault()) {
                        addr.setDefault(false);
                        addressRepository.save(addr);
                    }
                }
                existingAddress.setDefault(true);
            } else {
                // Handle setting isDefault to false when explicitly provided as false
                existingAddress.setDefault(false);
            }
        }

        Address updated = addressRepository.save(existingAddress);
        return AddressMapper.toAddressDto(updated);
    }

    @Override
    public void deleteAddress(Long addressId, User user) throws AddressException {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new AddressException("Unauthorized to delete this address");
        }

        addressRepository.delete(address);
    }

}
