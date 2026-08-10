package com.infosys.procurement.exception;

public class InvalidRequestStatusException extends RuntimeException {

    public InvalidRequestStatusException(String message) {
        super(message);
    }
}