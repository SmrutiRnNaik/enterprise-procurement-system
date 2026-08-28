package com.infosys.procurement.repository;

import com.infosys.procurement.entity.ProductCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCatalogRepository
        extends JpaRepository<ProductCatalog, Long> {

    List<ProductCatalog> findByCategory_CategoryIdOrderByProductNameAsc(
            Long categoryId
    );

}