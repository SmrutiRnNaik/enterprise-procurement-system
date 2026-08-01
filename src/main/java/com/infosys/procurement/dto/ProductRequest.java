package com.infosys.procurement.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductRequest {

    private String productName;

    private Long userId;

    private Long departmentId;

    private Long categoryId;

    private BigDecimal pricePerProduct;

    private Integer quantity;

    private String description;

}