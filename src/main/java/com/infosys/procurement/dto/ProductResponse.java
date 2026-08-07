package com.infosys.procurement.dto;

import com.infosys.procurement.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ProductResponse {

    private Long productId;

    private String productName;

    private String requestedBy;

    private String department;

    private String category;

    private BigDecimal pricePerProduct;

    private Integer quantity;

    private BigDecimal totalPrice;

    private ProductStatus status;

    private LocalDateTime createdDate;
}