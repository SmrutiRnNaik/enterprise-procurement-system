package com.infosys.procurement.service;

import com.infosys.procurement.dto.PaymentRequest;
import com.infosys.procurement.dto.PaymentResponse;
import com.infosys.procurement.dto.RequestResponse;

import java.util.List;

public interface PaymentService {

    RequestResponse<PaymentResponse> completePayment(
            PaymentRequest request
    );

    RequestResponse<List<PaymentResponse>> getAdminPaymentHistory(
            Long adminId
    );

    RequestResponse<List<PaymentResponse>> getSupplierPaymentHistory(
            Long supplierId
    );
}