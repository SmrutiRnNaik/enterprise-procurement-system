package com.infosys.procurement.service;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.entity.Product;

public interface ProductService {

    Product raiseRequest(ProductRequest request);

}