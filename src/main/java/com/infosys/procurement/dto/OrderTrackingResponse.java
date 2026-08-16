package com.infosys.procurement.dto;

import com.infosys.procurement.enums.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTrackingResponse {

    private Long orderTrackingId;

    private Long productId;

    private String productName;

    private Long supplierId;

    private String supplierName;

    private OrderStatus orderStatus;

    private LocalDateTime updatedDate;
}