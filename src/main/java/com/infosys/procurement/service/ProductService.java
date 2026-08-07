package com.infosys.procurement.service;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.dto.RequestResponse;

public interface ProductService {

    RequestResponse raiseRequest(ProductRequest request);

}