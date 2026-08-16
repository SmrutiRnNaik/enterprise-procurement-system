package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.OrderTrackingRequest;
import com.infosys.procurement.dto.OrderTrackingResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.OrderTracking;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.OrderTrackingRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.service.EmailService;
import com.infosys.procurement.service.OrderTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderTrackingServiceImpl implements OrderTrackingService {

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public RequestResponse<OrderTrackingResponse> updateOrderStatus(
            Long productId,
            OrderTrackingRequest request) {

        OrderTracking orderTracking = orderTrackingRepository
                .findByProduct_ProductId(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found."));

        orderTracking.setOrderStatus(request.getOrderStatus());

        OrderTracking savedOrder =
                orderTrackingRepository.saveAndFlush(orderTracking);

        savedOrder = orderTrackingRepository.findById(savedOrder.getOrderTrackingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found."));

        try {
            emailService.sendOrderTrackingNotification(savedOrder);
        } catch (Exception e) {
            // Email failure should not affect status update.
        }

        return new RequestResponse<>(
                "Order status updated successfully.",
                mapToResponse(savedOrder)
        );
    }

    @Override
    public RequestResponse<OrderTrackingResponse> getOrderStatus(
            Long productId) {

        OrderTracking orderTracking = orderTrackingRepository
                .findByProduct_ProductId(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found."));

        return new RequestResponse<>(
                "Order status fetched successfully.",
                mapToResponse(orderTracking)
        );
    }

    private OrderTrackingResponse mapToResponse(OrderTracking orderTracking) {

        Product product = orderTracking.getProduct();

        return OrderTrackingResponse.builder()
                .orderTrackingId(orderTracking.getOrderTrackingId())
                .productId(product.getProductId())
                .productName(product.getProductName())
                .supplierId(orderTracking.getSupplier().getSupplierId())
                .supplierName(orderTracking.getSupplier().getSupplierName())
                .orderStatus(orderTracking.getOrderStatus())
                .updatedDate(orderTracking.getUpdatedDate())
                .build();
    }
}