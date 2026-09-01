package com.infosys.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    /*
     * Product is selected from the product catalog.
     * Product name, price, category and supplier are
     * obtained automatically by the backend.
     */
    @NotNull(message = "Catalog product ID is required.")
    private Long catalogProductId;

    @NotNull(message = "User ID is required.")
    private Long userId;

    @NotNull(message = "Department ID is required.")
    private Long departmentId;

    @NotNull(message = "Quantity is required.")
    @Positive(message = "Quantity must be greater than zero.")
    private Integer quantity;

    @NotBlank(message = "Description is required.")
    private String description;
}