package com.infosys.procurement.controller;

import com.infosys.procurement.dto.RatingRequest;
import com.infosys.procurement.dto.RatingResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.dto.SupplierRatingResponse;
import com.infosys.procurement.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;


    /* =========================================================
       USER - RATE PRODUCT
    ========================================================= */

    @PostMapping
    public ResponseEntity<RequestResponse<RatingResponse>> rateProduct(
            @Valid @RequestBody RatingRequest request) {

        return ResponseEntity.ok(
                ratingService.rateProduct(request)
        );
    }


    /* =========================================================
       SUPPLIER - VIEW RATINGS
    ========================================================= */

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<RequestResponse<SupplierRatingResponse>>
    getSupplierRatings(
            @PathVariable Long supplierId) {

        return ResponseEntity.ok(
                ratingService.getSupplierRatings(
                        supplierId
                )
        );
    }


    /* =========================================================
       USER - VIEW OWN RATINGS
    ========================================================= */

    @GetMapping("/user/{userId}")
    public ResponseEntity<RequestResponse<List<RatingResponse>>>
    getUserRatings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                ratingService.getUserRatings(
                        userId
                )
        );
    }
}