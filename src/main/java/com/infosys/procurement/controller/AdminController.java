package com.infosys.procurement.controller;

import com.infosys.procurement.dto.AdminLoginRequest;
import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public Admin login(@RequestBody AdminLoginRequest request) {

        return adminService.login(
                request.getUsername(),
                request.getPassword());
    }
}