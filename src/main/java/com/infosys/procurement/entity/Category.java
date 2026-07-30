package com.infosys.procurement.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "departments")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(
            name = "category_name",
            nullable = false,
            unique = true,
            length = 100
    )
    private String categoryName;
    @JsonIgnore
    @ManyToMany(mappedBy = "categories")
    private Set<Department> departments = new HashSet<>();
}