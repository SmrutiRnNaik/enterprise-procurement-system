package com.infosys.procurement.controller;

import com.infosys.procurement.dto.LoginResponse;
import com.infosys.procurement.dto.SupplierLoginRequest;
import com.infosys.procurement.entity.Supplier;
import com.infosys.procurement.service.SupplierService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService supplierService;


    /* =========================================================
       SUPPLIER LOGIN
       ========================================================= */

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody SupplierLoginRequest request) {

        return supplierService.login(
                request.getEmail(),
                request.getPassword()
        );
    }


    /* =========================================================
       GET ALL SUPPLIERS
       ========================================================= */

    @GetMapping
    public List<Supplier> getAllSuppliers() {

        return supplierService.getAllSuppliers();
    }


    /* =========================================================
       GET SUPPLIER BY ID
       ========================================================= */

    @GetMapping("/{supplierId}")
    public Supplier getSupplierById(
            @PathVariable Long supplierId) {

        return supplierService.getSupplierById(
                supplierId
        );
    }


    /* =========================================================
       GET SUPPLIER BY EMAIL
       ========================================================= */

    @GetMapping("/email/{email}")
    public Supplier getSupplierByEmail(
            @PathVariable String email) {

        return supplierService.getSupplierByEmail(
                email
        );
    }
}