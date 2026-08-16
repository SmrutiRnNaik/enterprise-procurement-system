package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.PaymentRequest;
import com.infosys.procurement.dto.PaymentResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.*;
import com.infosys.procurement.enums.OrderStatus;
import com.infosys.procurement.enums.PaymentStatus;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.*;
import com.infosys.procurement.service.EmailService;
import com.infosys.procurement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public RequestResponse<PaymentResponse> completePayment(
            PaymentRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found."));

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new IllegalArgumentException(
                    "Payment can only be completed for approved requests.");
        }

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Supplier not found."));

        if (!supplier.getCategory().getCategoryId()
                .equals(product.getCategory().getCategoryId())) {

            throw new IllegalArgumentException(
                    "Selected supplier does not belong to the product category.");
        }

        accountRepository.findBySupplier_SupplierId(supplier.getSupplierId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Supplier account not found."));

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Admin not found."));

        paymentRepository.findByProduct_ProductId(product.getProductId())
                .ifPresent(payment -> {
                    throw new IllegalArgumentException(
                            "Payment already completed for this product.");
                });

        Payment payment = Payment.builder()
                .product(product)
                .supplier(supplier)
                .admin(admin)
                .amount(product.getTotalPrice())
                .paymentMode(request.getPaymentMode())
                .transactionReference(request.getTransactionReference())
                .paymentStatus(PaymentStatus.COMPLETED)
                .build();

        Payment savedPayment = paymentRepository.saveAndFlush(payment);

        savedPayment = paymentRepository.findById(savedPayment.getPaymentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found."));

        orderTrackingRepository.findByProduct_ProductId(product.getProductId())
                .orElseGet(() ->
                        orderTrackingRepository.save(
                                OrderTracking.builder()
                                        .product(product)
                                        .supplier(supplier)
                                        .orderStatus(OrderStatus.ORDER_RECEIVED)
                                        .build()
                        ));

        try {
            emailService.sendPaymentConfirmationToAdmin(admin, savedPayment);
            emailService.sendPaymentConfirmationToSupplier(supplier, savedPayment);
        } catch (Exception e) {
            // Email failure should not affect payment completion.
        }

        PaymentResponse response = PaymentResponse.builder()
                .paymentId(savedPayment.getPaymentId())
                .productId(product.getProductId())
                .productName(product.getProductName())
                .supplierId(supplier.getSupplierId())
                .supplierName(supplier.getSupplierName())
                .adminId(admin.getAdminId())
                .amount(savedPayment.getAmount())
                .paymentMode(savedPayment.getPaymentMode())
                .transactionReference(savedPayment.getTransactionReference())
                .paymentStatus(savedPayment.getPaymentStatus())
                .paymentDate(savedPayment.getPaymentDate())
                .build();

        return new RequestResponse<>(
                "Payment completed successfully.",
                response
        );
    }
}