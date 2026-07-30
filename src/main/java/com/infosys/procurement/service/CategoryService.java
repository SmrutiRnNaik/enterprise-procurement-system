package com.infosys.procurement.service;

import com.infosys.procurement.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> getCategoriesByDepartmentId(Long departmentId);

}