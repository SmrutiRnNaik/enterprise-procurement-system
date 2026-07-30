package com.infosys.procurement.repository;

import com.infosys.procurement.entity.ApprovalHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprovalHierarchyRepository extends JpaRepository<ApprovalHierarchy, Long> {

}