package com.infosys.procurement.dto;

import com.infosys.procurement.enums.PaymentMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotNull(message = "Product ID is required.")
    private Long productId;

    @NotNull(message = "Supplier ID is required.")
    private Long supplierId;

    @NotNull(message = "Admin ID is required.")
    private Long adminId;

    @NotNull(message = "Payment mode is required.")
    private PaymentMode paymentMode;

    @NotBlank(message = "Transaction reference is required.")
    private String transactionReference;
}