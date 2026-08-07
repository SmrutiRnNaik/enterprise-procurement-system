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
    public String register(@RequestBody User user) {

        userService.register(user);

        return "User registered successfully.";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {

        userService.login(
                loginRequest.getName(),
                loginRequest.getPassword());

        return "User logged in successfully.";
    }
}