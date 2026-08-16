package com.infosys.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "supplier")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false, unique = true)
    private Supplier supplier;

    @Column(name = "account_holder_name",
            nullable = false,
            length = 100)
    private String accountHolderName;

    @Column(name = "account_number",
            nullable = false,
            unique = true,
            length = 30)
    private String accountNumber;

    @Column(name = "ifsc_code",
            nullable = false,
            length = 11)
    private String ifscCode;

    @Column(name = "bank_name",
            nullable = false,
            length = 100)
    private String bankName;

    @Column(name = "created_date",
            nullable = false,
            insertable = false,
            updatable = false)
    private LocalDateTime createdDate;
}