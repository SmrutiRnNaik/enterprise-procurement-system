package com.infosys.procurement.controller;

import com.infosys.procurement.dto.ProductCatalogResponse;
import com.infosys.procurement.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-catalog")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductCatalogController {

    @Autowired
    private ProductCatalogService productCatalogService;

    @GetMapping
    public List<ProductCatalogResponse> getAllProducts() {
        return productCatalogService.getAllProducts();
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductCatalogResponse> getProductsByCategory(
            @PathVariable Long categoryId) {

        return productCatalogService.getProductsByCategory(categoryId);
    }

    @GetMapping("/{catalogProductId}")
    public ProductCatalogResponse getProductById(
            @PathVariable Long catalogProductId) {

        return productCatalogService.getProductById(catalogProductId);
    }
}