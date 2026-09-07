package com.infosys.procurement.service;

import com.infosys.procurement.dto.RatingRequest;
import com.infosys.procurement.dto.RatingResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.dto.SupplierRatingResponse;

import java.util.List;

public interface RatingService {

    RequestResponse<RatingResponse> rateProduct(
            RatingRequest request
    );

    RequestResponse<SupplierRatingResponse> getSupplierRatings(
            Long supplierId
    );

    RequestResponse<List<RatingResponse>> getUserRatings(
            Long userId
    );
}