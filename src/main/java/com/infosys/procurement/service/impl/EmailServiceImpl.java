package com.infosys.procurement.service.impl;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            logger.info("Email sent successfully to {}", to);

        } catch (Exception e) {

            logger.error("Failed to send email to {}", to, e);

            throw e;
        }
    }

    @Override
    public void sendNewRequestNotification(Admin admin, Product product) {

        String subject = "New Procurement Request";

        String body =
                "Dear Admin,\n\n" +
                        "A new procurement request has been submitted.\n\n" +

                        "Product Name : " + product.getProductName() + "\n" +
                        "Requested By : " + product.getUser().getName() + "\n" +
                        "Department   : " + product.getDepartment().getDepartmentName() + "\n" +
                        "Category     : " + product.getCategory().getCategoryName() + "\n" +
                        "Quantity     : " + product.getQuantity() + "\n" +
                        "Price        : ₹" + product.getPricePerProduct() + "\n" +
                        "Total Price  : ₹" + product.getTotalPrice() + "\n\n" +

                        "Please login to the Enterprise Procurement System to approve or reject this request.\n\n" +

                        "Regards,\n" +
                        "Enterprise Procurement System";

        sendEmail(
                admin.getEmail(),
                subject,
                body
        );
    }
}