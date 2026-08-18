package com.infosys.procurement.controller;

import com.infosys.procurement.dto.RatingRequest;
import com.infosys.procurement.dto.RatingResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<RequestResponse<RatingResponse>> rateProduct(
            @Valid @RequestBody RatingRequest request) {

        return ResponseEntity.ok(
                ratingService.rateProduct(request)
        );
    }
}