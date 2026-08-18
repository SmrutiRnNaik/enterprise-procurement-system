package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.RatingRequest;
import com.infosys.procurement.dto.RatingResponse;
import com.infosys.procurement.dto.RequestResponse;
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

    @Override
    public RequestResponse<RatingResponse> rateProduct(
            RatingRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found."));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        if (!product.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException(
                    "You can only rate your own procurement request.");
        }

        OrderTracking orderTracking = orderTrackingRepository
                .findByProduct_ProductId(product.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order tracking not found."));

        if (orderTracking.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException(
                    "Only delivered products can be rated.");
        }

        ratingRepository.findByProduct_ProductId(product.getProductId())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "This product has already been rated.");
                });

        Rating rating = Rating.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .description(request.getDescription())
                .build();

        Rating savedRating = ratingRepository.saveAndFlush(rating);

        savedRating = ratingRepository.findById(savedRating.getRatingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rating not found."));

        RatingResponse response = RatingResponse.builder()
                .ratingId(savedRating.getRatingId())
                .productId(product.getProductId())
                .productName(product.getProductName())
                .userId(user.getUserId())
                .userName(user.getName())
                .rating(savedRating.getRating())
                .description(savedRating.getDescription())
                .createdDate(savedRating.getCreatedDate())
                .build();

        return new RequestResponse<>(
                "Product rated successfully.",
                response
        );
    }
}