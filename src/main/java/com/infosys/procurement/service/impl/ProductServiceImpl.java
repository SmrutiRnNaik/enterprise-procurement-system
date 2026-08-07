package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Category;
import com.infosys.procurement.entity.Department;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.entity.User;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.repository.CategoryRepository;
import com.infosys.procurement.repository.DepartmentRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.repository.UserRepository;
import com.infosys.procurement.service.EmailService;
import com.infosys.procurement.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public RequestResponse<ProductResponse> raiseRequest(ProductRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found."));

        Product product = new Product();

        product.setProductName(request.getProductName());
        product.setUser(user);
        product.setDepartment(department);
        product.setCategory(category);
        product.setPricePerProduct(request.getPricePerProduct());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());

        BigDecimal totalPrice = request.getPricePerProduct()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        product.setTotalPrice(totalPrice);

        product.setStatus(ProductStatus.PENDING_APPROVAL);
        product.setCreatedDate(LocalDateTime.now());
        product.setUpdatedDate(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        Admin admin = adminRepository.findById(1L)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Admin not found."));

        // Send notification email
        try {
            emailService.sendNewRequestNotification(admin, savedProduct);
        } catch (Exception e) {
            // Email failure should not stop request creation.
            // Error is already logged in EmailServiceImpl.
        }

        ProductResponse productResponse = ProductResponse.builder()
                .productId(savedProduct.getProductId())
                .productName(savedProduct.getProductName())
                .requestedBy(savedProduct.getUser().getName())
                .department(savedProduct.getDepartment().getDepartmentName())
                .category(savedProduct.getCategory().getCategoryName())
                .pricePerProduct(savedProduct.getPricePerProduct())
                .quantity(savedProduct.getQuantity())
                .totalPrice(savedProduct.getTotalPrice())
                .status(savedProduct.getStatus())
                .createdDate(savedProduct.getCreatedDate())
                .build();

        return new RequestResponse<>(
                "Request submitted successfully.",
                productResponse
        );
    }
}