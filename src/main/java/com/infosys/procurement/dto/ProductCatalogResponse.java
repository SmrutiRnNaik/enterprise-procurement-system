package com.infosys.procurement.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCatalogResponse {

    private Long catalogProductId;
    private String productName;
    private BigDecimal price;

    private Long categoryId;
    private String categoryName;

    private Long supplierId;
    private String supplierName;
}