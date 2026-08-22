package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.DashboardCountResponse;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public DashboardCountResponse getCounts(Long userId) {

        return DashboardCountResponse.builder()
                .totalRequests(productRepository.countByUser_UserId(userId))
                .pending(productRepository.countByUser_UserIdAndStatus(
                        userId,
                        ProductStatus.PENDING_APPROVAL))
                .approved(productRepository.countByUser_UserIdAndStatus(
                        userId,
                        ProductStatus.APPROVED))
                .rejected(productRepository.countByUser_UserIdAndStatus(
                        userId,
                        ProductStatus.REJECTED))
                .build();
    }
}