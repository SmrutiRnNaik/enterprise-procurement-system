package com.infosys.procurement.entity;

import com.infosys.procurement.enums.SupplierStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "supplier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "category")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "supplier_name",
            nullable = false,
            length = 100)
    private String supplierName;

    @Column(name = "phone",
            nullable = false,
            unique = true,
            length = 10)
    private String phone;

    @Column(name = "address",
            nullable = false,
            length = 255)
    private String address;

    @Column(name = "email",
            nullable = false,
            unique = true,
            length = 100)
    private String email;

    @Column(name = "gst_number",
            nullable = false,
            unique = true,
            length = 15)
    private String gstNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SupplierStatus status;

    @Column(name = "rating",
            precision = 2,
            scale = 1)
    private BigDecimal rating;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
}