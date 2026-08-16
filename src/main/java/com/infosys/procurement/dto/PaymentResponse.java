package com.infosys.procurement.dto;

import com.infosys.procurement.enums.PaymentMode;
import com.infosys.procurement.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long paymentId;

    private Long productId;

    private String productName;

    private Long supplierId;

    private String supplierName;

    private Long adminId;

    private BigDecimal amount;

    private PaymentMode paymentMode;

    private String transactionReference;

    private PaymentStatus paymentStatus;

    private LocalDateTime paymentDate;
}