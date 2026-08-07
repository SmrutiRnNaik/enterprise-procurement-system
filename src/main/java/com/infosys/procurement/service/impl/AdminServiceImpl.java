package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.InvalidCredentialsException;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Admin login(String username, String password) {

        return adminRepository
                .findByUsernameAndPassword(username, password)
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid admin credentials."));
    }

    @Override
    public RequestResponse<List<ProductResponse>> getPendingRequests() {

        List<Product> products =
                productRepository.findByStatusOrderByCreatedDateDesc(
                        ProductStatus.PENDING_APPROVAL
                );

        List<ProductResponse> responses = products.stream()
                .map(product -> ProductResponse.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .requestedBy(product.getUser().getName())
                        .department(product.getDepartment().getDepartmentName())
                        .category(product.getCategory().getCategoryName())
                        .pricePerProduct(product.getPricePerProduct())
                        .quantity(product.getQuantity())
                        .totalPrice(product.getTotalPrice())
                        .status(product.getStatus())
                        .createdDate(product.getCreatedDate())
                        .build())
                .toList();

        return new RequestResponse<>(
                "Pending requests fetched successfully.",
                responses
        );
    }
}