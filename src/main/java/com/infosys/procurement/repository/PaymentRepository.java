package com.infosys.procurement.repository;

import com.infosys.procurement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByProduct_ProductId(Long productId);

    List<Payment> findByAdmin_AdminIdOrderByPaymentDateDesc(
            Long adminId
    );

    List<Payment> findBySupplier_SupplierIdOrderByPaymentDateDesc(
            Long supplierId
    );
}