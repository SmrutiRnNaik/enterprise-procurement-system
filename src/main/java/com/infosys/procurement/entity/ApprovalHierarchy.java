package com.infosys.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "approval_hierarchy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "department")
public class ApprovalHierarchy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_hierarchy_id")
    private Long approvalHierarchyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "approval_level", nullable = false)
    private Integer approvalLevel;
}