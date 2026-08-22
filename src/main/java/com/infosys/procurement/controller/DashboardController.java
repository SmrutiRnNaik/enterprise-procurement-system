package com.infosys.procurement.controller;

import com.infosys.procurement.dto.DashboardCountResponse;
import com.infosys.procurement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/counts/{userId}")
    public DashboardCountResponse getCounts(@PathVariable Long userId) {
        return dashboardService.getCounts(userId);
    }
}