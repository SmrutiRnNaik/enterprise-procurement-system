package com.infosys.procurement.controller;

import com.infosys.procurement.dto.LoginRequest;
import com.infosys.procurement.dto.LoginResponse;
import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.User;
import com.infosys.procurement.exception.InvalidCredentialsException;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminRepository adminRepository;


    /* =========================================================
       REGISTER
       ========================================================= */

    @PostMapping("/register")
    public String register(
            @Valid @RequestBody User user) {

        userService.register(user);

        return "User registered successfully.";
    }


    /* =========================================================
       COMMON LOGIN
       USER + ADMIN
       ========================================================= */

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest loginRequest) {


        /*
         * First check normal USER credentials.
         */

        try {

            User user = userService.login(
                    loginRequest.getName(),
                    loginRequest.getPassword()
            );

            return LoginResponse.builder()

                    .userId(user.getUserId())

                    .name(user.getName())

                    .email(user.getEmail())

                    .designation(user.getDesignation())

                    .departmentId(
                            user.getDepartment()
                                    .getDepartmentId()
                    )

                    .role("USER")

                    .message(
                            "User logged in successfully."
                    )

                    .build();

        } catch (InvalidCredentialsException userException) {


            /*
             * User credentials did not match.
             * Now check the ADMIN table.
             */

            Admin admin =
                    adminRepository
                            .findByUsernameAndPassword(
                                    loginRequest.getName(),
                                    loginRequest.getPassword()
                            )
                            .orElseThrow(() ->
                                    new InvalidCredentialsException(
                                            "Invalid username or password."
                                    ));


            /*
             * Admin does not have a department,
             * therefore departmentId is null.
             */

            return LoginResponse.builder()

                    .userId(admin.getAdminId())

                    .name(admin.getUsername())

                    .email(admin.getEmail())

                    .designation("Administrator")

                    .departmentId(null)

                    .role("ADMIN")

                    .message(
                            "Admin logged in successfully."
                    )

                    .build();
        }
    }
}