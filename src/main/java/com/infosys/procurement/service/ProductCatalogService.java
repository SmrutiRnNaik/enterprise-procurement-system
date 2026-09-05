package com.infosys.procurement.service;

import com.infosys.procurement.dto.ProductCatalogResponse;

import java.util.List;

public interface ProductCatalogService {

    List<ProductCatalogResponse> getAllProducts();

    List<ProductCatalogResponse> getProductsByCategory(Long categoryId);

    ProductCatalogResponse getProductById(Long catalogProductId);
}