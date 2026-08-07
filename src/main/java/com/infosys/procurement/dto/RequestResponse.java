package com.infosys.procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RequestResponse<T> {

    private String message;

    private T data;

}