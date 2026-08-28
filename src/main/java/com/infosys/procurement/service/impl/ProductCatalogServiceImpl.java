package com.infosys.procurement.service;

import com.infosys.procurement.entity.ProductCatalog;
import com.infosys.procurement.repository.ProductCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCatalogServiceImpl
        implements ProductCatalogService {

    @Autowired
    private ProductCatalogRepository productCatalogRepository;


    @Override
    public List<ProductCatalog> getAllProducts() {

        return productCatalogRepository.findAll();

    }


    @Override
    public List<ProductCatalog> getProductsByCategory(
            Long categoryId
    ) {

        return productCatalogRepository
                .findByCategory_CategoryIdOrderByProductNameAsc(
                        categoryId
                );

    }


    @Override
    public ProductCatalog getProductById(
            Long catalogProductId
    ) {

        return productCatalogRepository
                .findById(catalogProductId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Product not found."
                        )
                );

    }

}