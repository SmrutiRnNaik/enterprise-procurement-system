package com.infosys.procurement.service;

import com.infosys.procurement.entity.Department;

import java.util.List;

public interface DepartmentService {

    List<Department> getAllDepartments();

    Department getDepartmentById(Long departmentId);

}