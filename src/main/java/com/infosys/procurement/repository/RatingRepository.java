package com.infosys.procurement.repository;

import com.infosys.procurement.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByProduct_ProductId(Long productId);

    List<Rating> findByProduct_Supplier_SupplierIdOrderByCreatedDateDesc(
            Long supplierId
    );

    List<Rating> findByUser_UserIdOrderByCreatedDateDesc(
            Long userId
    );
}