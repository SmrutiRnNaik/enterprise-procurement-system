package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.RatingRequest;
import com.infosys.procurement.dto.RatingResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.dto.SupplierRatingResponse;
import com.infosys.procurement.entity.OrderTracking;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.entity.Rating;
import com.infosys.procurement.entity.User;
import com.infosys.procurement.enums.OrderStatus;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.OrderTrackingRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.repository.RatingRepository;
import com.infosys.procurement.repository.UserRepository;
import com.infosys.procurement.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;


    /* =========================================================
       USER - RATE PRODUCT
    ========================================================= */

    @Override
    @Transactional
    public RequestResponse<RatingResponse> rateProduct(
            RatingRequest request) {

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found."
                        ));


        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));


        /*
         * User can rate only their own procurement request.
         */

        if (!product.getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new IllegalArgumentException(
                    "You can only rate your own procurement request."
            );
        }


        /*
         * Order tracking must exist.
         */

        OrderTracking orderTracking =
                orderTrackingRepository
                        .findByProduct_ProductId(
                                product.getProductId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order tracking not found."
                                ));


        /*
         * Only delivered products can be rated.
         */

        if (orderTracking.getOrderStatus()
                != OrderStatus.DELIVERED) {

            throw new IllegalArgumentException(
                    "Only delivered products can be rated."
            );
        }


        /*
         * One rating per procurement request.
         */

        ratingRepository
                .findByProduct_ProductId(
                        product.getProductId()
                )
                .ifPresent(existing -> {

                    throw new IllegalArgumentException(
                            "This product has already been rated."
                    );

                });


        Rating rating =
                Rating.builder()
                        .product(product)
                        .user(user)
                        .rating(request.getRating())
                        .description(request.getDescription())
                        .build();


        Rating savedRating =
                ratingRepository.saveAndFlush(
                        rating
                );


        savedRating =
                ratingRepository
                        .findById(
                                savedRating.getRatingId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Rating not found."
                                ));


        RatingResponse response =
                mapToRatingResponse(
                        savedRating
                );


        return new RequestResponse<>(
                "Product rated successfully.",
                response
        );
    }


    /* =========================================================
       SUPPLIER - VIEW RATINGS
    ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public RequestResponse<SupplierRatingResponse> getSupplierRatings(
            Long supplierId) {

        List<Rating> ratings =
                ratingRepository
                        .findByProduct_Supplier_SupplierIdOrderByCreatedDateDesc(
                                supplierId
                        );


        long totalRatings =
                ratings.size();


        long fiveStarCount =
                ratings.stream()
                        .filter(r -> r.getRating() == 5)
                        .count();


        long fourStarCount =
                ratings.stream()
                        .filter(r -> r.getRating() == 4)
                        .count();


        long threeStarCount =
                ratings.stream()
                        .filter(r -> r.getRating() == 3)
                        .count();


        long twoStarCount =
                ratings.stream()
                        .filter(r -> r.getRating() == 2)
                        .count();


        long oneStarCount =
                ratings.stream()
                        .filter(r -> r.getRating() == 1)
                        .count();


        double averageRating =
                ratings.stream()
                        .mapToInt(Rating::getRating)
                        .average()
                        .orElse(0.0);


        averageRating =
                Math.round(
                        averageRating * 100.0
                ) / 100.0;


        List<RatingResponse> ratingResponses =
                ratings.stream()
                        .map(this::mapToRatingResponse)
                        .toList();


        SupplierRatingResponse response =
                SupplierRatingResponse.builder()
                        .averageRating(averageRating)
                        .totalRatings(totalRatings)
                        .fiveStarCount(fiveStarCount)
                        .fourStarCount(fourStarCount)
                        .threeStarCount(threeStarCount)
                        .twoStarCount(twoStarCount)
                        .oneStarCount(oneStarCount)
                        .ratings(ratingResponses)
                        .build();


        return new RequestResponse<>(
                "Supplier ratings fetched successfully.",
                response
        );
    }


    /* =========================================================
       USER - VIEW OWN RATINGS
    ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public RequestResponse<List<RatingResponse>> getUserRatings(
            Long userId) {

        /*
         * Verify that the user exists.
         */

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));


        /*
         * Fetch all ratings submitted by this user.
         */

        List<Rating> ratings =
                ratingRepository
                        .findByUser_UserIdOrderByCreatedDateDesc(
                                userId
                        );


        /*
         * Convert ratings into response DTOs.
         */

        List<RatingResponse> ratingResponses =
                ratings.stream()
                        .map(this::mapToRatingResponse)
                        .toList();


        return new RequestResponse<>(
                "User ratings fetched successfully.",
                ratingResponses
        );
    }


    /* =========================================================
       RATING RESPONSE MAPPER
    ========================================================= */

    private RatingResponse mapToRatingResponse(
            Rating rating) {

        Product product =
                rating.getProduct();

        User user =
                rating.getUser();


        return RatingResponse.builder()

                .ratingId(
                        rating.getRatingId()
                )

                .productId(
                        product.getProductId()
                )

                .productName(
                        product.getProductName()
                )

                .quantity(
                        product.getQuantity()
                )

                .userId(
                        user.getUserId()
                )

                .userName(
                        user.getName()
                )

                .rating(
                        rating.getRating()
                )

                .description(
                        rating.getDescription()
                )

                .createdDate(
                        rating.getCreatedDate()
                )

                .build();
    }
}