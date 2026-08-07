package com.infosys.procurement.service;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

}