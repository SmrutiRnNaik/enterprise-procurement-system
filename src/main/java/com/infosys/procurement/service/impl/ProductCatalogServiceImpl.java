package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.ProductCatalogResponse;
import com.infosys.procurement.entity.ProductCatalog;
import com.infosys.procurement.repository.ProductCatalogRepository;
import com.infosys.procurement.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductCatalogServiceImpl implements ProductCatalogService {

    @Autowired
    private ProductCatalogRepository productCatalogRepository;

    private ProductCatalogResponse convertToResponse(ProductCatalog product) {

        return ProductCatalogResponse.builder()
                .catalogProductId(product.getCatalogProductId())
                .productName(product.getProductName())
                .price(product.getPrice())
                .categoryId(product.getCategory().getCategoryId())
                .categoryName(product.getCategory().getCategoryName())
                .supplierId(product.getSupplier().getSupplierId())
                .supplierName(product.getSupplier().getSupplierName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCatalogResponse> getAllProducts() {

        return productCatalogRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCatalogResponse> getProductsByCategory(Long categoryId) {

        return productCatalogRepository
                .findByCategory_CategoryIdOrderByProductNameAsc(categoryId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductCatalogResponse getProductById(Long catalogProductId) {

        ProductCatalog product = productCatalogRepository
                .findById(catalogProductId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found.")
                );

        return convertToResponse(product);
    }
}