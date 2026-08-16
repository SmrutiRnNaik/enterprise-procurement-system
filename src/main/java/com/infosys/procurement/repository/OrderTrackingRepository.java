package com.infosys.procurement.repository;

import com.infosys.procurement.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderTrackingRepository
        extends JpaRepository<OrderTracking, Long> {

    Optional<OrderTracking> findByProduct_ProductId(Long productId);
}