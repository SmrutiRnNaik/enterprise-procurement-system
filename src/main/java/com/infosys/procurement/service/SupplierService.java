package com.infosys.procurement.service;

import com.infosys.procurement.dto.LoginResponse;
import com.infosys.procurement.entity.Supplier;

import java.util.List;

public interface SupplierService {

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long supplierId);

    Supplier getSupplierByEmail(String email);

    LoginResponse login(
            String email,
            String password
    );
}