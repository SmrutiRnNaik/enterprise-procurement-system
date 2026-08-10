package com.infosys.procurement.service;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Product;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

    void sendNewRequestNotification(Admin admin, Product product);

    void sendRequestStatusNotification(Product product);
}