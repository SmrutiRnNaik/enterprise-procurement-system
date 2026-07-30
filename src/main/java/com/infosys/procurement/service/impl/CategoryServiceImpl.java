package com.infosys.procurement.service.impl;

import com.infosys.procurement.entity.Category;
import com.infosys.procurement.repository.CategoryRepository;
import com.infosys.procurement.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getCategoriesByDepartmentId(Long departmentId) {
        return categoryRepository.findByDepartmentsDepartmentId(departmentId);
    }
}