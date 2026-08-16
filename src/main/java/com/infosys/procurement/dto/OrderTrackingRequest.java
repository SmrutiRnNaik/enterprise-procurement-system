package com.infosys.procurement.dto;

import com.infosys.procurement.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTrackingRequest {

    @NotNull(message = "Order status is required.")
    private OrderStatus orderStatus;
}