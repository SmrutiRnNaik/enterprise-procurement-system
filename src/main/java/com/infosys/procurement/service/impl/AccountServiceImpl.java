package com.infosys.procurement.service.impl;

import com.infosys.procurement.dto.AccountRequest;
import com.infosys.procurement.dto.AccountResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.entity.Account;
import com.infosys.procurement.entity.Supplier;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.AccountRepository;
import com.infosys.procurement.repository.SupplierRepository;
import com.infosys.procurement.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public RequestResponse<AccountResponse> createAccount(
            AccountRequest request) {

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Supplier not found."));

        Account account = Account.builder()
                .supplier(supplier)
                .accountHolderName(request.getAccountHolderName())
                .accountNumber(request.getAccountNumber())
                .ifscCode(request.getIfscCode())
                .bankName(request.getBankName())
                .build();

        Account savedAccount = accountRepository.save(account);

        return new RequestResponse<>(
                "Account created successfully.",
                mapToResponse(savedAccount)
        );
    }

    @Override
    public RequestResponse<AccountResponse> getAccountBySupplierId(
            Long supplierId) {

        Account account = accountRepository.findBySupplier_SupplierId(supplierId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found."));

        return new RequestResponse<>(
                "Account details fetched successfully.",
                mapToResponse(account)
        );
    }

    private AccountResponse mapToResponse(Account account) {

        return AccountResponse.builder()
                .accountId(account.getAccountId())
                .supplierId(account.getSupplier().getSupplierId())
                .supplierName(account.getSupplier().getSupplierName())
                .accountHolderName(account.getAccountHolderName())
                .accountNumber(account.getAccountNumber())
                .ifscCode(account.getIfscCode())
                .bankName(account.getBankName())
                .createdDate(account.getCreatedDate())
                .build();
    }
}