package com.infosys.procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardCountResponse {

    private Long totalRequests;
    private Long pending;
    private Long approved;
    private Long rejected;

}