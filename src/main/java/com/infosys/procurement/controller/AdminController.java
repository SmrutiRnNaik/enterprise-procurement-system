package com.infosys.procurement.controller;

import com.infosys.procurement.dto.AdminLoginRequest;
import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public String login(@Valid @RequestBody AdminLoginRequest request) {

        adminService.login(
                request.getUsername(),
                request.getPassword());

        return "Admin logged in successfully.";
    }

    @GetMapping("/pending-requests")
    public RequestResponse<List<ProductResponse>> getPendingRequests() {

        return adminService.getPendingRequests();

    }
}