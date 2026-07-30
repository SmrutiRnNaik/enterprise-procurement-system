package com.infosys.procurement.service;

import com.infosys.procurement.entity.User;

public interface UserService {

    User register(User user);

    User login(String name, String password);

}