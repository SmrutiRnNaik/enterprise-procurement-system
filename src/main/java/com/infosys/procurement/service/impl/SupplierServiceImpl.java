package com.infosys.procurement.service.impl;

import com.infosys.procurement.config.SupplierCredentials;
import com.infosys.procurement.dto.LoginResponse;
import com.infosys.procurement.entity.Supplier;
import com.infosys.procurement.exception.InvalidCredentialsException;
import com.infosys.procurement.repository.SupplierRepository;
import com.infosys.procurement.service.SupplierService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierCredentials supplierCredentials;


    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }


    @Override
    public Supplier getSupplierById(Long supplierId) {

        return supplierRepository.findById(supplierId)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));
    }


    @Override
    public Supplier getSupplierByEmail(String email) {

        return supplierRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));
    }


    @Override
    public LoginResponse login(
            String email,
            String password) {

        Supplier supplier =
                supplierRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "Invalid email or password."
                                )
                        );


        // Check supplier account status
        if (supplier.getStatus() == null ||
                !"ACTIVE".equals(
                        supplier.getStatus().name()
                )) {

            throw new InvalidCredentialsException(
                    "Supplier account is inactive."
            );
        }


        // Check password
        if (!supplierCredentials.isValidPassword(
                supplier.getSupplierId(),
                password
        )) {

            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }


        // Successful login
        return LoginResponse.builder()
                .userId(supplier.getSupplierId())
                .name(supplier.getSupplierName())
                .email(supplier.getEmail())
                .designation("Supplier")
                .departmentId(null)
                .role("SUPPLIER")
                .message("Supplier logged in successfully.")
                .build();
    }
}