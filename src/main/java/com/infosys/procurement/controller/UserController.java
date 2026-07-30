package com.infosys.procurement.controller;

import com.infosys.procurement.dto.LoginRequest;
import com.infosys.procurement.entity.User;
import com.infosys.procurement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return userService.register(user);

    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) {

        return userService.login(
                loginRequest.getName(),
                loginRequest.getPassword());

    }
}