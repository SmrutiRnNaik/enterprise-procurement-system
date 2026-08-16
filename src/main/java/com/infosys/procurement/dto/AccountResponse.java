package com.infosys.procurement.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {

    private Long accountId;

    private Long supplierId;

    private String supplierName;

    private String accountHolderName;

    private String accountNumber;

    private String ifscCode;

    private String bankName;

    private LocalDateTime createdDate;
}