package com.infosys.procurement.dto;

import com.infosys.procurement.enums.PaymentMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotNull(message = "Product ID is required.")
    private Long productId;

    @NotNull(message = "Admin ID is required.")
    private Long adminId;

    @NotNull(message = "Payment mode is required.")
    private PaymentMode paymentMode;

    @NotBlank(message = "Transaction reference is required.")
    private String transactionReference;

    /*
     * MPIN is required only for UPI payments.
     *
     * Accepts:
     * - 4 digits
     * - 6 digits
     */
    @Pattern(
            regexp = "^$|^\\d{4}$|^\\d{6}$",
            message = "MPIN must contain exactly 4 or 6 digits."
    )
    private String mpin;
}