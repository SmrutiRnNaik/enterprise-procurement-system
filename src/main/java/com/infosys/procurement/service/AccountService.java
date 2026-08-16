package com.infosys.procurement.service;

import com.infosys.procurement.dto.AccountRequest;
import com.infosys.procurement.dto.AccountResponse;
import com.infosys.procurement.dto.RequestResponse;

public interface AccountService {

    RequestResponse<AccountResponse> createAccount(
            AccountRequest request
    );

    RequestResponse<AccountResponse> getAccountBySupplierId(
            Long supplierId
    );
}