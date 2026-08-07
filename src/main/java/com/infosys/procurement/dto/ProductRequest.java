package com.infosys.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Product name is required.")
    private String productName;

    @NotNull(message = "User ID is required.")
    private Long userId;

    @NotNull(message = "Department ID is required.")
    private Long departmentId;

    @NotNull(message = "Category ID is required.")
    private Long categoryId;

    @NotNull(message = "Price per product is required.")
    @Positive(message = "Price per product must be greater than zero.")
    private BigDecimal pricePerProduct;

    @NotNull(message = "Quantity is required.")
    @Positive(message = "Quantity must be greater than zero.")
    private Integer quantity;

    @NotBlank(message = "Description is required.")
    private String description;
}