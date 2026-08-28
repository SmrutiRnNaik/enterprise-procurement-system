package com.infosys.procurement.repository;

import com.infosys.procurement.entity.Product;
import com.infosys.procurement.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatusOrderByCreatedDateDesc(
            ProductStatus status
    );

    List<Product> findByUser_UserIdOrderByCreatedDateDesc(
            Long userId
    );

    List<Product> findByStatusInOrderByUpdatedDateDesc(
            List<ProductStatus> statuses
    );

    /*
     * Returns ALL procurement requests,
     * including PENDING_APPROVAL, APPROVED
     * and REJECTED.
     */
    List<Product> findAllByOrderByCreatedDateDesc();

    Long countByUser_UserId(Long userId);

    Long countByUser_UserIdAndStatus(
            Long userId,
            ProductStatus status
    );
}