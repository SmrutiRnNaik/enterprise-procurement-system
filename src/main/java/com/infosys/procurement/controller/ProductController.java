package com.infosys.procurement.controller;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/request")
    public RequestResponse raiseRequest(
            @Valid @RequestBody ProductRequest request) {

        return productService.raiseRequest(request);

    }
}