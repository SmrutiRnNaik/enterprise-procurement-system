package com.infosys.procurement.service;

import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.Admin;

import java.util.List;

public interface AdminService {

    Admin login(String username, String password);

    RequestResponse<List<ProductResponse>> getPendingRequests();

}