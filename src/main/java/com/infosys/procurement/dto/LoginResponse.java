package com.infosys.procurement.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private Long userId;

    private String name;

    private String email;

    private String designation;

    private Long departmentId;

    private String message;
}