package com.infosys.procurement.service;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Product;

import java.util.List;

public interface AdminService {

    Admin login(String username, String password);

    List<Product> getPendingRequests();

}