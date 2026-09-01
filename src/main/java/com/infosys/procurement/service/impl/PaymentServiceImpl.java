package com.infosys.procurement.service.impl;

import com.infosys.procurement.config.PaymentConfig;
import com.infosys.procurement.dto.PaymentRequest;
import com.infosys.procurement.dto.PaymentResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.OrderTracking;
import com.infosys.procurement.entity.Payment;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.entity.Supplier;
import com.infosys.procurement.enums.OrderStatus;
import com.infosys.procurement.enums.PaymentMode;
import com.infosys.procurement.enums.PaymentStatus;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.AccountRepository;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.repository.OrderTrackingRepository;
import com.infosys.procurement.repository.PaymentRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.service.EmailService;
import com.infosys.procurement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    @Autowired
    private EmailService emailService;


    /* =========================================================
       COMPLETE PAYMENT
       ========================================================= */

    @Override
    public RequestResponse<PaymentResponse> completePayment(
            PaymentRequest request) {

        /* =====================================================
           FIND PRODUCT
           ===================================================== */

        Product product =
                productRepository.findById(
                                request.getProductId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found."
                                )
                        );


        /* =====================================================
           PAYMENT ONLY FOR APPROVED REQUESTS
           ===================================================== */

        if (product.getStatus() != ProductStatus.APPROVED) {

            throw new IllegalArgumentException(
                    "Payment can only be completed for approved requests."
            );
        }


        /* =====================================================
           AUTOMATICALLY GET SUPPLIER FROM PRODUCT

           The supplier is NOT supplied by the frontend.
           Product already contains the correct supplier.
           ===================================================== */

        Supplier supplier = product.getSupplier();


        if (supplier == null) {

            throw new ResourceNotFoundException(
                    "Supplier is not assigned to this product."
            );
        }


        /* =====================================================
           VERIFY SUPPLIER CATEGORY
           ===================================================== */

        if (supplier.getCategory() == null) {

            throw new ResourceNotFoundException(
                    "Supplier category not found."
            );
        }


        if (product.getCategory() == null) {

            throw new ResourceNotFoundException(
                    "Product category not found."
            );
        }


        if (!supplier.getCategory()
                .getCategoryId()
                .equals(
                        product.getCategory()
                                .getCategoryId()
                )) {

            throw new IllegalArgumentException(
                    "Supplier does not belong to the product category."
            );
        }


        /* =====================================================
           PREVENT DUPLICATE PAYMENT
           ===================================================== */

        paymentRepository
                .findByProduct_ProductId(
                        product.getProductId()
                )
                .ifPresent(payment -> {

                    throw new IllegalArgumentException(
                            "Payment already completed for this product."
                    );

                });


        /* =====================================================
           FIND ADMIN
           ===================================================== */

        Admin admin =
                adminRepository.findById(
                                request.getAdminId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Admin not found."
                                )
                        );


        /* =====================================================
           UPI MPIN VALIDATION

           MPIN belongs to the automatically selected supplier.
           ===================================================== */

        if (request.getPaymentMode() == PaymentMode.UPI) {

            String correctMpin =
                    PaymentConfig.getMpin(
                            supplier.getSupplierId()
                    );


            if (correctMpin == null) {

                throw new IllegalArgumentException(
                        "MPIN is not configured for this supplier."
                );
            }


            if (request.getMpin() == null
                    || !correctMpin.equals(
                    request.getMpin()
            )) {

                throw new IllegalArgumentException(
                        "Invalid MPIN."
                );
            }
        }


        /* =====================================================
           VERIFY SUPPLIER ACCOUNT
           ===================================================== */

        accountRepository
                .findBySupplier_SupplierId(
                        supplier.getSupplierId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier account not found."
                        )
                );


        /* =====================================================
           CREATE PAYMENT
           ===================================================== */

        Payment payment =
                Payment.builder()

                        .product(product)

                        .supplier(supplier)

                        .admin(admin)

                        .amount(
                                product.getTotalPrice()
                        )

                        .paymentMode(
                                request.getPaymentMode()
                        )

                        .transactionReference(
                                request.getTransactionReference()
                        )

                        .paymentStatus(
                                PaymentStatus.COMPLETED
                        )

                        .build();


        Payment savedPayment =
                paymentRepository.saveAndFlush(
                        payment
                );


        /* =====================================================
           RELOAD PAYMENT

           paymentDate is generated by the database, so reload
           the entity to obtain the generated payment date.
           ===================================================== */

        savedPayment =
                paymentRepository.findById(
                                savedPayment.getPaymentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found."
                                )
                        );


        /* =====================================================
           CREATE ORDER TRACKING
           ===================================================== */

        orderTrackingRepository
                .findByProduct_ProductId(
                        product.getProductId()
                )
                .orElseGet(() ->
                        orderTrackingRepository.save(

                                OrderTracking.builder()

                                        .product(product)

                                        .supplier(supplier)

                                        .orderStatus(
                                                OrderStatus.ORDER_RECEIVED
                                        )

                                        .build()
                        )
                );


        /* =====================================================
           SEND PAYMENT NOTIFICATIONS
           ===================================================== */

        try {

            emailService.sendPaymentConfirmationToAdmin(
                    admin,
                    savedPayment
            );


            emailService.sendPaymentConfirmationToSupplier(
                    supplier,
                    savedPayment
            );

        } catch (Exception e) {

            /*
             * Email failure must not affect payment completion.
             */

        }


        /* =====================================================
           BUILD RESPONSE
           ===================================================== */

        PaymentResponse response =
                mapToPaymentResponse(
                        savedPayment
                );


        return new RequestResponse<>(
                "Payment completed successfully.",
                response
        );
    }


    /* =========================================================
       ADMIN PAYMENT HISTORY
       ========================================================= */

    @Override
    public RequestResponse<List<PaymentResponse>> getAdminPaymentHistory(
            Long adminId) {

        /* =====================================================
           VERIFY ADMIN
           ===================================================== */

        adminRepository.findById(adminId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin not found."
                        )
                );


        /* =====================================================
           FETCH ADMIN PAYMENTS
           ===================================================== */

        List<Payment> payments =
                paymentRepository
                        .findByAdmin_AdminIdOrderByPaymentDateDesc(
                                adminId
                        );


        /* =====================================================
           MAP TO RESPONSE
           ===================================================== */

        List<PaymentResponse> responses =
                payments.stream()
                        .map(this::mapToPaymentResponse)
                        .toList();


        return new RequestResponse<>(
                "Admin payment history fetched successfully.",
                responses
        );
    }


    /* =========================================================
       SUPPLIER PAYMENT HISTORY
       ========================================================= */

    @Override
    public RequestResponse<List<PaymentResponse>> getSupplierPaymentHistory(
            Long supplierId) {

        /* =====================================================
           VERIFY SUPPLIER
           ===================================================== */

        /*
         * Supplier module is currently pending, but the backend
         * method is retained for future supplier functionality.
         */

        // supplierRepository.findById(supplierId)
        //         .orElseThrow(...);


        /* =====================================================
           FETCH SUPPLIER PAYMENTS
           ===================================================== */

        List<Payment> payments =
                paymentRepository
                        .findBySupplier_SupplierIdOrderByPaymentDateDesc(
                                supplierId
                        );


        /* =====================================================
           MAP TO RESPONSE
           ===================================================== */

        List<PaymentResponse> responses =
                payments.stream()
                        .map(this::mapToPaymentResponse)
                        .toList();


        return new RequestResponse<>(
                "Supplier payment history fetched successfully.",
                responses
        );
    }


    /* =========================================================
       PAYMENT → RESPONSE
       ========================================================= */

    private PaymentResponse mapToPaymentResponse(
            Payment payment) {

        return PaymentResponse.builder()

                .paymentId(
                        payment.getPaymentId()
                )

                .productId(
                        payment.getProduct()
                                .getProductId()
                )

                .productName(
                        payment.getProduct()
                                .getProductName()
                )

                .supplierId(
                        payment.getSupplier()
                                .getSupplierId()
                )

                .supplierName(
                        payment.getSupplier()
                                .getSupplierName()
                )

                .adminId(
                        payment.getAdmin()
                                .getAdminId()
                )

                .amount(
                        payment.getAmount()
                )

                .paymentMode(
                        payment.getPaymentMode()
                )

                .transactionReference(
                        payment.getTransactionReference()
                )

                .paymentStatus(
                        payment.getPaymentStatus()
                )

                .paymentDate(
                        payment.getPaymentDate()
                )

                .build();
    }
}