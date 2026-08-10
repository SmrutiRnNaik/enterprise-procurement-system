package com.infosys.procurement.dto;

import com.infosys.procurement.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestStatusUpdate {

    @NotNull(message = "Status is required.")
    private ProductStatus status;
}