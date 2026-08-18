package com.infosys.procurement.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {

    private Long ratingId;

    private Long productId;

    private String productName;

    private Long userId;

    private String userName;

    private Integer rating;

    private String description;

    private LocalDateTime createdDate;
}