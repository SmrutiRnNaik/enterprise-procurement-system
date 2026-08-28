package com.infosys.procurement.controller;

import com.infosys.procurement.entity.ProductCatalog;
import com.infosys.procurement.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-catalog")
public class ProductCatalogController {

    @Autowired
    private ProductCatalogService productCatalogService;


    @GetMapping
    public List<ProductCatalog> getAllProducts() {

        return productCatalogService.getAllProducts();

    }


    @GetMapping("/category/{categoryId}")
    public List<ProductCatalog> getProductsByCategory(
            @PathVariable Long categoryId
    ) {

        return productCatalogService
                .getProductsByCategory(categoryId);

    }


    @GetMapping("/{catalogProductId}")
    public ProductCatalog getProductById(
            @PathVariable Long catalogProductId
    ) {

        return productCatalogService
                .getProductById(catalogProductId);

    }

}