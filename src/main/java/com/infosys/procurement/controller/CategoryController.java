package com.infosys.procurement.controller;

import com.infosys.procurement.entity.Category;
import com.infosys.procurement.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/department/{departmentId}")
    public List<Category> getCategoriesByDepartmentId(
            @PathVariable Long departmentId) {

        return categoryService.getCategoriesByDepartmentId(departmentId);
    }
}