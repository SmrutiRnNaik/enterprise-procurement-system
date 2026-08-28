package com.infosys.procurement.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "product_catalog",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_catalog_product_category",
                        columnNames = {
                                "product_name",
                                "category_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "category")
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class ProductCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "catalog_product_id")
    private Long catalogProductId;


    @Column(
            name = "product_name",
            nullable = false,
            length = 150
    )
    private String productName;


    @Column(
            name = "price",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal price;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "category_id",
            nullable = false
    )
    private Category category;

}