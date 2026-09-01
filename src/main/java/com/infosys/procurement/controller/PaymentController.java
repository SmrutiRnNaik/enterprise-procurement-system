package com.infosys.procurement.controller;

import com.infosys.procurement.dto.PaymentRequest;
import com.infosys.procurement.dto.PaymentResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    /* =========================================================
       COMPLETE PAYMENT
       ========================================================= */

    @PostMapping
    public RequestResponse<PaymentResponse> completePayment(
            @Valid @RequestBody PaymentRequest request) {

        return paymentService.completePayment(request);
    }


    /* =========================================================
       ADMIN PAYMENT HISTORY
       ========================================================= */

    @GetMapping("/admin/{adminId}/history")
    public RequestResponse<List<PaymentResponse>> getAdminPaymentHistory(
            @PathVariable Long adminId) {

        return paymentService.getAdminPaymentHistory(
                adminId
        );
    }


    /* =========================================================
       SUPPLIER PAYMENT HISTORY
       ========================================================= */

    @GetMapping("/supplier/{supplierId}/history")
    public RequestResponse<List<PaymentResponse>> getSupplierPaymentHistory(
            @PathVariable Long supplierId) {

        return paymentService.getSupplierPaymentHistory(
                supplierId
        );
    }
}