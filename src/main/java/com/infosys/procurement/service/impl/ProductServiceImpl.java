package com.infosys.procurement.service.impl;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;

import com.infosys.procurement.entity.Admin;
import com.infosys.procurement.entity.Category;
import com.infosys.procurement.entity.Department;
import com.infosys.procurement.entity.Product;
import com.infosys.procurement.entity.ProductCatalog;
import com.infosys.procurement.entity.Supplier;
import com.infosys.procurement.entity.User;

import com.infosys.procurement.enums.ProductStatus;

import com.infosys.procurement.exception.ResourceNotFoundException;

import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.repository.DepartmentRepository;
import com.infosys.procurement.repository.ProductCatalogRepository;
import com.infosys.procurement.repository.ProductRepository;
import com.infosys.procurement.repository.UserRepository;

import com.infosys.procurement.service.EmailService;
import com.infosys.procurement.service.ProductService;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ProductCatalogRepository productCatalogRepository;

    @Autowired
    private EmailService emailService;


    /* =========================================================
       RAISE REQUEST
       ========================================================= */

    @Override
    public RequestResponse<ProductResponse> raiseRequest(
            ProductRequest request) {

        /* =====================================================
           FIND USER
           ===================================================== */

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );


        /* =====================================================
           FIND DEPARTMENT
           ===================================================== */

        Department department =
                departmentRepository.findById(
                                request.getDepartmentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found."
                                )
                        );


        /* =====================================================
           FIND PRODUCT FROM CATALOG
           ===================================================== */

        ProductCatalog catalogProduct =
                productCatalogRepository.findById(
                                request.getCatalogProductId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Catalog product not found."
                                )
                        );


        /* =====================================================
           GET CATEGORY FROM CATALOG
           ===================================================== */

        Category category =
                catalogProduct.getCategory();


        if (category == null) {

            throw new ResourceNotFoundException(
                    "Category is not configured for this product."
            );
        }


        /* =====================================================
           GET SUPPLIER FROM CATALOG
           ===================================================== */

        Supplier supplier =
                catalogProduct.getSupplier();


        if (supplier == null) {

            throw new ResourceNotFoundException(
                    "Supplier is not configured for this product."
            );
        }


        /* =====================================================
           VERIFY SUPPLIER IS ACTIVE
           ===================================================== */

        if (supplier.getStatus() == null ||
                !"ACTIVE".equals(
                        supplier.getStatus().name()
                )) {

            throw new IllegalArgumentException(
                    "Supplier is not active."
            );
        }


        /* =====================================================
           CREATE PRODUCT REQUEST
           ===================================================== */

        Product product = new Product();


        /*
         * Product name comes from ProductCatalog.
         */
        product.setProductName(
                catalogProduct.getProductName()
        );


        /*
         * User comes from logged-in/user request.
         */
        product.setUser(user);


        /*
         * Department comes from request.
         */
        product.setDepartment(department);


        /*
         * Category comes automatically from catalog.
         */
        product.setCategory(category);


        /*
         * Supplier comes automatically from catalog.
         */
        product.setSupplier(supplier);


        /*
         * Price comes automatically from catalog.
         */
        product.setPricePerProduct(
                catalogProduct.getPrice()
        );


        /*
         * Quantity comes from user.
         */
        product.setQuantity(
                request.getQuantity()
        );


        /*
         * Description comes from user.
         */
        product.setDescription(
                request.getDescription()
        );


        /* =====================================================
           CALCULATE TOTAL PRICE
           ===================================================== */

        BigDecimal totalPrice =
                catalogProduct.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        request.getQuantity()
                                )
                        );

        product.setTotalPrice(totalPrice);


        /* =====================================================
           SET INITIAL STATUS
           ===================================================== */

        product.setStatus(
                ProductStatus.PENDING_APPROVAL
        );


        LocalDateTime now =
                LocalDateTime.now();

        product.setCreatedDate(now);

        product.setUpdatedDate(now);


        /* =====================================================
           SAVE REQUEST
           ===================================================== */

        Product savedProduct =
                productRepository.save(product);


        /* =====================================================
           NOTIFY ADMIN
           ===================================================== */

        Admin admin =
                adminRepository.findById(1L)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Admin not found."
                                )
                        );


        try {

            emailService.sendNewRequestNotification(
                    admin,
                    savedProduct
            );

        } catch (Exception e) {

            /*
             * Email failure should not stop
             * request creation.
             */
        }


        return new RequestResponse<>(
                "Request submitted successfully.",
                mapToProductResponse(savedProduct)
        );
    }


    /* =========================================================
       REQUEST HISTORY
       ========================================================= */

    @Override
    public RequestResponse<List<ProductResponse>> getActionHistory(
            String type,
            Long id) {

        List<Product> products;

        String message;


        /* =====================================================
           USER HISTORY
           ===================================================== */

        if ("user".equalsIgnoreCase(type)) {

            if (id == null) {

                throw new IllegalArgumentException(
                        "User id is required when type is user."
                );
            }


            userRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found."
                            )
                    );


            products =
                    productRepository
                            .findByUser_UserIdOrderByCreatedDateDesc(
                                    id
                            );


            message =
                    "User request history fetched successfully.";
        }


        /* =====================================================
           ADMIN HISTORY

           Includes:

           PENDING_APPROVAL
           APPROVED
           REJECTED
           ===================================================== */

        else if ("admin".equalsIgnoreCase(type)) {

            products =
                    productRepository
                            .findAllByOrderByCreatedDateDesc();


            message =
                    "Admin request history fetched successfully.";
        }


        /* =====================================================
           INVALID TYPE
           ===================================================== */

        else {

            throw new IllegalArgumentException(
                    "Invalid type. Use user or admin."
            );
        }


        List<ProductResponse> responses =
                products.stream()
                        .map(this::mapToProductResponse)
                        .toList();


        return new RequestResponse<>(
                message,
                responses
        );
    }


    /* =========================================================
       DOWNLOAD REQUEST HISTORY
       ========================================================= */

    @Override
    public byte[] downloadActionHistory(
            String type,
            Long id,
            String format) {

        List<Product> products =
                getProductsForHistory(type, id);


        switch (format.toLowerCase()) {

            case "csv":

                return generateCsv(products);


            case "xlsx":

            case "excel":

                return generateExcel(products);


            case "pdf":

                return generatePdf(products);


            default:

                throw new IllegalArgumentException(
                        "Invalid format. Use csv, xlsx or pdf."
                );
        }
    }


    /* =========================================================
       GET PRODUCTS FOR DOWNLOAD
       ========================================================= */

    private List<Product> getProductsForHistory(
            String type,
            Long id) {


        /* =====================================================
           USER DOWNLOAD
           ===================================================== */

        if ("user".equalsIgnoreCase(type)) {

            if (id == null) {

                throw new IllegalArgumentException(
                        "User id is required when type is user."
                );
            }


            userRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found."
                            )
                    );


            return productRepository
                    .findByUser_UserIdOrderByCreatedDateDesc(
                            id
                    );
        }


        /* =====================================================
           ADMIN DOWNLOAD
           ===================================================== */

        if ("admin".equalsIgnoreCase(type)) {

            return productRepository
                    .findAllByOrderByCreatedDateDesc();
        }


        throw new IllegalArgumentException(
                "Invalid type. Use user or admin."
        );
    }


    /* =========================================================
       MAP PRODUCT → RESPONSE
       ========================================================= */

    private ProductResponse mapToProductResponse(
            Product product) {

        return ProductResponse.builder()

                .productId(
                        product.getProductId()
                )

                .productName(
                        product.getProductName()
                )

                .requestedBy(
                        product.getUser().getName()
                )

                .department(
                        product.getDepartment()
                                .getDepartmentName()
                )

                .category(
                        product.getCategory()
                                .getCategoryName()
                )

                .supplierId(
                        product.getSupplier().getSupplierId()
                )

                .supplierName(
                        product.getSupplier().getSupplierName()
                )

                .pricePerProduct(
                        product.getPricePerProduct()
                )

                .quantity(
                        product.getQuantity()
                )

                .totalPrice(
                        product.getTotalPrice()
                )

                .status(
                        product.getStatus()
                )

                .createdDate(
                        product.getCreatedDate()
                )

                .build();
    }


    /* =========================================================
       GENERATE CSV
       ========================================================= */

    private byte[] generateCsv(
            List<Product> products) {

        StringBuilder csv =
                new StringBuilder();


        csv.append(
                "Product ID,"
                        + "Product Name,"
                        + "Requested By,"
                        + "Department,"
                        + "Category,"
                        + "Supplier,"
                        + "Quantity,"
                        + "Price Per Product,"
                        + "Total Price,"
                        + "Status,"
                        + "Created Date\n"
        );


        for (Product product : products) {

            csv.append(
                    product.getProductId()
            ).append(",");


            csv.append(
                    escapeCsv(
                            product.getProductName()
                    )
            ).append(",");


            csv.append(
                    escapeCsv(
                            product.getUser().getName()
                    )
            ).append(",");


            csv.append(
                    escapeCsv(
                            product.getDepartment()
                                    .getDepartmentName()
                    )
            ).append(",");


            csv.append(
                    escapeCsv(
                            product.getCategory()
                                    .getCategoryName()
                    )
            ).append(",");


            csv.append(
                    escapeCsv(
                            product.getSupplier()
                                    .getSupplierName()
                    )
            ).append(",");


            csv.append(
                    product.getQuantity()
            ).append(",");


            csv.append(
                    product.getPricePerProduct()
            ).append(",");


            csv.append(
                    product.getTotalPrice()
            ).append(",");


            csv.append(
                    product.getStatus()
            ).append(",");


            csv.append(
                    product.getCreatedDate()
            ).append("\n");
        }


        return csv.toString()
                .getBytes(StandardCharsets.UTF_8);
    }


    /* =========================================================
       ESCAPE CSV
       ========================================================= */

    private String escapeCsv(
            String value) {

        if (value == null) {

            return "";
        }


        if (value.contains(",")
                || value.contains("\"")
                || value.contains("\n")) {

            return "\""
                    + value.replace(
                    "\"",
                    "\"\""
            )
                    + "\"";
        }


        return value;
    }


    /* =========================================================
       GENERATE EXCEL
       ========================================================= */

    private byte[] generateExcel(
            List<Product> products) {

        try (

                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()

        ) {


            Sheet sheet =
                    workbook.createSheet(
                            "Procurement Requests"
                    );


            String[] headers = {

                    "Product ID",
                    "Product Name",
                    "Requested By",
                    "Department",
                    "Category",
                    "Supplier",
                    "Quantity",
                    "Price Per Product",
                    "Total Price",
                    "Status",
                    "Created Date"

            };


            Row header =
                    sheet.createRow(0);


            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                header.createCell(i)
                        .setCellValue(
                                headers[i]
                        );
            }


            int rowNumber = 1;


            for (Product product : products) {

                Row row =
                        sheet.createRow(
                                rowNumber++
                        );


                row.createCell(0)
                        .setCellValue(
                                product.getProductId()
                        );


                row.createCell(1)
                        .setCellValue(
                                product.getProductName()
                        );


                row.createCell(2)
                        .setCellValue(
                                product.getUser().getName()
                        );


                row.createCell(3)
                        .setCellValue(
                                product.getDepartment()
                                        .getDepartmentName()
                        );


                row.createCell(4)
                        .setCellValue(
                                product.getCategory()
                                        .getCategoryName()
                        );


                row.createCell(5)
                        .setCellValue(
                                product.getSupplier()
                                        .getSupplierName()
                        );


                row.createCell(6)
                        .setCellValue(
                                product.getQuantity()
                        );


                row.createCell(7)
                        .setCellValue(
                                product.getPricePerProduct()
                                        .doubleValue()
                        );


                row.createCell(8)
                        .setCellValue(
                                product.getTotalPrice()
                                        .doubleValue()
                        );


                row.createCell(9)
                        .setCellValue(
                                product.getStatus()
                                        .toString()
                        );


                row.createCell(10)
                        .setCellValue(
                                product.getCreatedDate()
                                        .toString()
                        );
            }


            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                sheet.autoSizeColumn(i);
            }


            workbook.write(outputStream);


            return outputStream.toByteArray();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate Excel file.",
                    e
            );
        }
    }


    /* =========================================================
       GENERATE PDF
       ========================================================= */

    private byte[] generatePdf(
            List<Product> products) {

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {


            Document document =
                    new Document(
                            PageSize.A4.rotate()
                    );


            PdfWriter.getInstance(
                    document,
                    outputStream
            );


            document.open();


            document.add(
                    new Paragraph(
                            "Procurement Request Report"
                    )
            );


            float[] columnWidths = {

                    0.7f,
                    2.3f,
                    1.5f,
                    1.4f,
                    1.2f,
                    1.6f,
                    0.7f,
                    1.3f,
                    1.4f,
                    1.5f,
                    2.0f

            };


            PdfPTable table =
                    new PdfPTable(
                            columnWidths
                    );


            table.setWidthPercentage(100);

            table.setSplitRows(true);

            table.setSplitLate(false);

            table.setHeaderRows(1);


            String[] headers = {

                    "ID",
                    "Product",
                    "Requested By",
                    "Department",
                    "Category",
                    "Supplier",
                    "Qty",
                    "Price",
                    "Total",
                    "Status",
                    "Created"

            };


            for (String header : headers) {

                PdfPCell cell =
                        new PdfPCell(
                                new Phrase(header)
                        );

                table.addCell(cell);
            }


            for (Product product : products) {

                table.addCell(
                        String.valueOf(
                                product.getProductId()
                        )
                );


                table.addCell(
                        product.getProductName()
                );


                table.addCell(
                        product.getUser().getName()
                );


                table.addCell(
                        product.getDepartment()
                                .getDepartmentName()
                );


                table.addCell(
                        product.getCategory()
                                .getCategoryName()
                );


                table.addCell(
                        product.getSupplier()
                                .getSupplierName()
                );


                table.addCell(
                        String.valueOf(
                                product.getQuantity()
                        )
                );


                table.addCell(
                        String.valueOf(
                                product.getPricePerProduct()
                        )
                );


                table.addCell(
                        String.valueOf(
                                product.getTotalPrice()
                        )
                );


                table.addCell(
                        product.getStatus()
                                .toString()
                );


                table.addCell(
                        product.getCreatedDate()
                                .toString()
                );
            }


            document.add(table);


            document.close();


            return outputStream.toByteArray();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate PDF file.",
                    e
            );
        }
    }
}