package com.infosys.procurement.service.impl;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin login(String username, String password) {

        return adminRepository
                .findByUsernameAndPassword(username, password)
                .orElseThrow(() ->
                        new RuntimeException("Invalid admin credentials."));
    }
}