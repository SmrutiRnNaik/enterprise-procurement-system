package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.InvalidCredentialsException;
import com.infosys.procurement.exception.InvalidRequestStatusException;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.service.AdminService;
import com.infosys.procurement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public Admin login(String username, String password) {

        return adminRepository
                .findByUsernameAndPassword(username, password)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid admin credentials."));
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

    @Override
    public RequestResponse<ProductResponse> updateRequestStatus(
            Long productId,
            ProductStatus status) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product request not found."));

        if (product.getStatus() != ProductStatus.PENDING_APPROVAL) {
            throw new InvalidRequestStatusException(
                    "Only pending requests can be approved or rejected."
            );
        }

        if (status != ProductStatus.APPROVED &&
                status != ProductStatus.REJECTED) {

            throw new InvalidRequestStatusException(
                    "Status must be APPROVED or REJECTED."
            );
        }

        product.setStatus(status);

        if (status == ProductStatus.APPROVED) {
            product.setDescription("It is approved.");
        } else {
            product.setDescription("It is rejected.");
        }

        product.setUpdatedDate(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);

        // Send notification email to the user
        try {
            emailService.sendRequestStatusNotification(updatedProduct);
        } catch (Exception e) {
            // Email failure should not stop the status update.
            // The error is already logged in EmailServiceImpl.
        }

        ProductResponse productResponse = ProductResponse.builder()
                .productId(updatedProduct.getProductId())
                .productName(updatedProduct.getProductName())
                .requestedBy(updatedProduct.getUser().getName())
                .department(updatedProduct.getDepartment().getDepartmentName())
                .category(updatedProduct.getCategory().getCategoryName())
                .pricePerProduct(updatedProduct.getPricePerProduct())
                .quantity(updatedProduct.getQuantity())
                .totalPrice(updatedProduct.getTotalPrice())
                .status(updatedProduct.getStatus())
                .createdDate(updatedProduct.getCreatedDate())
                .build();

        String message;

        if (status == ProductStatus.APPROVED) {
            message = "Request approved successfully.";
        } else {
            message = "Request rejected successfully.";
        }

        return new RequestResponse<>(
                message,
                productResponse
        );
    }
}