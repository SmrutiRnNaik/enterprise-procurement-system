package com.infosys.procurement.config;

import java.util.Map;

public final class PaymentConfig {

    private PaymentConfig() {
    }

    /*
     * Dummy MPIN mapping for internship demonstration.
     *
     * Each supplier has one unique 4-digit MPIN.
     *
     * Supplier ID -> MPIN
     */

    private static final Map<Long, String> SUPPLIER_MPIN = Map.ofEntries(

            Map.entry(1L, "1234"),   // Dell India
            Map.entry(2L, "5678"),   // HP India
            Map.entry(3L, "9012"),   // Furniture World
            Map.entry(4L, "3456"),   // Cisco Distributor
            Map.entry(5L, "2468"),   // Lenovo India
            Map.entry(6L, "1357"),   // Canon India
            Map.entry(7L, "7890"),   // Epson India
            Map.entry(8L, "1122"),   // Godrej Interio
            Map.entry(9L, "4455"),   // Classmate Office Supplies
            Map.entry(10L, "7788"),  // JK Paper Office Solutions
            Map.entry(11L, "9988"),  // TP-Link India
            Map.entry(12L, "2233"),  // Apple India
            Map.entry(13L, "5566"),  // Brother India
            Map.entry(14L, "6677"),  // Logitech India
            Map.entry(15L, "8899")   // D-Link India
    );

    public static String getMpin(Long supplierId) {

        return SUPPLIER_MPIN.get(supplierId);
    }
}