package com.infosys.procurement.controller;

import com.infosys.procurement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/api/test/mail")
    public String sendTestMail() {

        emailService.sendEmail(
                "smrutiranjannaik5@gmail.com",
                "SMTP Test",
                "Congratulations! Your Spring Boot SMTP configuration is working.");

        return "Email sent successfully.";
    }
}