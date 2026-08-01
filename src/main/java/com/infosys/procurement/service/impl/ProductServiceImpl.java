package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.entity.Category;
import com.infosys.procurement.entity.Department;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.entity.User;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.CategoryRepository;
import com.infosys.procurement.repository.DepartmentRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.repository.UserRepository;
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

    @Override
    public Product raiseRequest(ProductRequest request) {

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

        BigDecimal totalPrice =
                request.getPricePerProduct()
                        .multiply(BigDecimal.valueOf(request.getQuantity()));

        product.setTotalPrice(totalPrice);

        product.setStatus(ProductStatus.PENDING_APPROVAL);

        product.setCreatedDate(LocalDateTime.now());
        product.setUpdatedDate(LocalDateTime.now());

        return productRepository.save(product);
    }
}