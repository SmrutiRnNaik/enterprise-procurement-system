package com.infosys.procurement.controller;

import com.infosys.procurement.dto.OrderTrackingRequest;
import com.infosys.procurement.dto.OrderTrackingResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.OrderTrackingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderTrackingController {

    @Autowired
    private OrderTrackingService orderTrackingService;

    @PutMapping("/status/{productId}")
    public RequestResponse<OrderTrackingResponse> updateOrderStatus(
            @PathVariable Long productId,
            @Valid @RequestBody OrderTrackingRequest request) {

        return orderTrackingService.updateOrderStatus(productId, request);
    }

    @GetMapping("/status/{productId}")
    public RequestResponse<OrderTrackingResponse> getOrderStatus(
            @PathVariable Long productId) {

        return orderTrackingService.getOrderStatus(productId);
    }
}