package com.infosys.procurement.service.impl;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.exception.InvalidCredentialsException;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.repository.ProductRepository;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Admin login(String username, String password) {

        return adminRepository
                .findByUsernameAndPassword(username, password)
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid admin credentials."));
    }

    @Override
    public List<Product> getPendingRequests() {

        return productRepository.findByStatus(ProductStatus.PENDING_APPROVAL);

    }
}