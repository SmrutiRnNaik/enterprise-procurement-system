package com.infosys.procurement.service.impl;

import com.infosys.procurement.entity.User;
import com.infosys.procurement.repository.UserRepository;
import com.infosys.procurement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(User user) {

        if (userRepository.existsByName(user.getName())) {
            throw new RuntimeException("Username already exists.");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists.");
        }

        return userRepository.save(user);
    }

    @Override
    public User login(String name, String password) {

        return userRepository.findByNameAndPassword(name, password)
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password."));
    }
}