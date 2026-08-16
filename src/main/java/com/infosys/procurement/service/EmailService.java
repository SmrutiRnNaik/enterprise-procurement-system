package com.infosys.procurement.service;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.OrderTracking;
import com.infosys.procurement.entity.Payment;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.entity.Supplier;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

    void sendNewRequestNotification(Admin admin, Product product);

    void sendRequestStatusNotification(Product product);

    void sendPaymentConfirmationToAdmin(
            Admin admin,
            Payment payment
    );

    void sendPaymentConfirmationToSupplier(
            Supplier supplier,
            Payment payment
    );

    void sendOrderTrackingNotification(
            OrderTracking orderTracking
    );
}