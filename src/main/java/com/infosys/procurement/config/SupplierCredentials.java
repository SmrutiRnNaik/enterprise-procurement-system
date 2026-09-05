package com.infosys.procurement.config;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class SupplierCredentials {

    private final Map<Long, String> passwords = new HashMap<>();

    public SupplierCredentials() {

        passwords.put(1L, "dell123");
        passwords.put(2L, "hp123");
        passwords.put(3L, "furniture123");
        passwords.put(4L, "cisco123");
        passwords.put(5L, "lenovo123");
        passwords.put(6L, "canon123");
        passwords.put(7L, "epson123");
        passwords.put(8L, "godrej123");
        passwords.put(9L, "classmate123");
        passwords.put(10L, "jkpaper123");
        passwords.put(11L, "tplink123");
        passwords.put(12L, "apple123");
        passwords.put(13L, "brother123");
        passwords.put(14L, "logitech123");
        passwords.put(15L, "dlink123");
    }

    public boolean isValidPassword(
            Long supplierId,
            String password) {

        String storedPassword =
                passwords.get(supplierId);

        return storedPassword != null
                && storedPassword.equals(password);
    }
}