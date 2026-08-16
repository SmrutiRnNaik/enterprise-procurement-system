package com.infosys.procurement.service;

import com.infosys.procurement.dto.PaymentRequest;
import com.infosys.procurement.dto.PaymentResponse;
import com.infosys.procurement.dto.RequestResponse;

public interface PaymentService {

    RequestResponse<PaymentResponse> completePayment(
            PaymentRequest request
    );
}