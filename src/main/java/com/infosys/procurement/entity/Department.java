package com.infosys.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "department")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "categories")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Long departmentId;

    @Column(
            name = "department_name",
            nullable = false,
            unique = true,
            length = 100
    )
    private String departmentName;

    @Column(
            name = "manager_name",
            nullable = false,
            length = 100
    )
    private String managerName;

    @ManyToMany
    @JoinTable(
            name = "department_category",
            joinColumns = @JoinColumn(name = "department_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
}