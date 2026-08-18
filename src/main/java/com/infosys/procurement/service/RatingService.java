package com.infosys.procurement.service;

import com.infosys.procurement.dto.RatingRequest;
import com.infosys.procurement.dto.RatingResponse;
import com.infosys.procurement.dto.RequestResponse;

public interface RatingService {

    RequestResponse<RatingResponse> rateProduct(
            RatingRequest request
    );
}