package com.infosys.procurement.controller;

import com.infosys.procurement.dto.AccountRequest;
import com.infosys.procurement.dto.AccountResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public RequestResponse<AccountResponse> createAccount(
            @Valid @RequestBody AccountRequest request) {

        return accountService.createAccount(request);
    }

    @GetMapping("/supplier/{supplierId}")
    public RequestResponse<AccountResponse> getAccountBySupplierId(
            @PathVariable Long supplierId) {

        return accountService.getAccountBySupplierId(supplierId);
    }
}