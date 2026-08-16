package com.infosys.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {

    @NotNull(message = "Supplier ID is required.")
    private Long supplierId;

    @NotBlank(message = "Account holder name is required.")
    private String accountHolderName;

    @NotBlank(message = "Account number is required.")
    @Pattern(regexp = "^[0-9]{9,18}$",
            message = "Account number must contain 9 to 18 digits.")
    private String accountNumber;

    @NotBlank(message = "IFSC code is required.")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",
            message = "Invalid IFSC code.")
    private String ifscCode;

    @NotBlank(message = "Bank name is required.")
    private String bankName;
}