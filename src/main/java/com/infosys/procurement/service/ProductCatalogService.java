package com.infosys.procurement.service;

import com.infosys.procurement.entity.ProductCatalog;

import java.util.List;

public interface ProductCatalogService {

    List<ProductCatalog> getAllProducts();

    List<ProductCatalog> getProductsByCategory(Long categoryId);

    ProductCatalog getProductById(Long catalogProductId);
}