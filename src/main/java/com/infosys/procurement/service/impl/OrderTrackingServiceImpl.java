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
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderTrackingServiceImpl implements OrderTrackingService {

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;


    @Override
    @Transactional
    public RequestResponse<OrderTrackingResponse> updateOrderStatus(
            Long productId,
            OrderTrackingRequest request) {

        /*
         * First check whether an order tracking record
         * already exists for this procurement request.
         */
        OrderTracking orderTracking =
                orderTrackingRepository
                        .findByProduct_ProductId(productId)
                        .orElse(null);


        /*
         * If the supplier is starting the order for the
         * first time, create the tracking record.
         */
        if (orderTracking == null) {

            Product product =
                    productRepository
                            .findById(productId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Product request not found."
                                    )
                            );


            /*
             * Supplier is already associated with the
             * Product when the procurement request is created.
             */
            if (product.getSupplier() == null) {

                throw new ResourceNotFoundException(
                        "No supplier is assigned to this request."
                );
            }


            orderTracking = OrderTracking.builder()
                    .product(product)
                    .supplier(product.getSupplier())
                    .orderStatus(request.getOrderStatus())
                    .build();

        } else {

            /*
             * Existing order: simply update its status.
             */
            orderTracking.setOrderStatus(
                    request.getOrderStatus()
            );
        }


        OrderTracking savedOrder =
                orderTrackingRepository.saveAndFlush(
                        orderTracking
                );


        /*
         * Reload the record so database-generated fields
         * such as updatedDate are available.
         */
        savedOrder =
                orderTrackingRepository
                        .findById(
                                savedOrder.getOrderTrackingId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found."
                                )
                        );


        /*
         * Send supplier/order tracking notification.
         * Email failure must not prevent the status update.
         */
        try {

            emailService.sendOrderTrackingNotification(
                    savedOrder
            );

        } catch (Exception e) {

            // Email failure should not affect status update.

        }


        return new RequestResponse<>(
                "Order status updated successfully.",
                mapToResponse(savedOrder)
        );
    }


    @Override
    @Transactional(readOnly = true)
    public RequestResponse<OrderTrackingResponse> getOrderStatus(
            Long productId) {

        OrderTracking orderTracking =
                orderTrackingRepository
                        .findByProduct_ProductId(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found."
                                )
                        );


        return new RequestResponse<>(
                "Order status fetched successfully.",
                mapToResponse(orderTracking)
        );
    }


    private OrderTrackingResponse mapToResponse(
            OrderTracking orderTracking) {

        Product product =
                orderTracking.getProduct();


        return OrderTrackingResponse.builder()
                .orderTrackingId(
                        orderTracking.getOrderTrackingId()
                )
                .productId(
                        product.getProductId()
                )
                .productName(
                        product.getProductName()
                )
                .supplierId(
                        orderTracking
                                .getSupplier()
                                .getSupplierId()
                )
                .supplierName(
                        orderTracking
                                .getSupplier()
                                .getSupplierName()
                )
                .orderStatus(
                        orderTracking.getOrderStatus()
                )
                .updatedDate(
                        orderTracking.getUpdatedDate()
                )
                .build();
    }
}