package com.infosys.procurement.controller;

import com.infosys.procurement.dto.PaymentRequest;
import com.infosys.procurement.dto.PaymentResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public RequestResponse<PaymentResponse> completePayment(
            @Valid @RequestBody PaymentRequest request) {

        return paymentService.completePayment(request);
    }
}