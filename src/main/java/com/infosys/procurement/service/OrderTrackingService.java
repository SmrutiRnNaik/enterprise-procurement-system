package com.infosys.procurement.service;

import com.infosys.procurement.dto.OrderTrackingRequest;
import com.infosys.procurement.dto.OrderTrackingResponse;
import com.infosys.procurement.dto.RequestResponse;

public interface OrderTrackingService {

    RequestResponse<OrderTrackingResponse> updateOrderStatus(
            Long productId,
            OrderTrackingRequest request
    );

    RequestResponse<OrderTrackingResponse> getOrderStatus(
            Long productId
    );
}