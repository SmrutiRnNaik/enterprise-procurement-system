package com.infosys.procurement.service;

import com.infosys.procurement.entity.Admin;

public interface AdminService {

    Admin login(String username, String password);

}