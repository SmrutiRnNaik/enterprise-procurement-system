package com.infosys.procurement.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "department")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "name",
            nullable = false,
            length = 100)
    private String name;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password",
            nullable = false,
            length = 255)
    private String password;


    @Column(name = "phone_number",
            nullable = false,
            unique = true,
            length = 10)
    private String phoneNumber;

    @Column(name = "email",
            nullable = false,
            unique = true,
            length = 100)
    private String email;

    @Column(name = "designation",
            nullable = false,
            length = 100)
    private String designation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}