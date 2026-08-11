package com.infosys.procurement.service;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;

import java.util.List;

public interface ProductService {

    RequestResponse<ProductResponse> raiseRequest(
            ProductRequest request
    );

    RequestResponse<List<ProductResponse>> getActionHistory(
            String type,
            Long id
    );

    byte[] downloadActionHistory(
            String type,
            Long id,
            String format
    );
}