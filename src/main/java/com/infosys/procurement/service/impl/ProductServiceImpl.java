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
import com.infosys.procurement.entity.User;
import com.infosys.procurement.enums.ProductStatus;
import com.infosys.procurement.exception.ResourceNotFoundException;
import com.infosys.procurement.repository.AdminRepository;
import com.infosys.procurement.repository.CategoryRepository;
import com.infosys.procurement.repository.DepartmentRepository;
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
    private CategoryRepository categoryRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmailService emailService;


    @Override
    public RequestResponse<ProductResponse> raiseRequest(
            ProductRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));

        Department department = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found."));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found."));

        Product product = new Product();

        product.setProductName(request.getProductName());
        product.setUser(user);
        product.setDepartment(department);
        product.setCategory(category);
        product.setPricePerProduct(
                request.getPricePerProduct());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());

        BigDecimal totalPrice =
                request.getPricePerProduct()
                        .multiply(
                                BigDecimal.valueOf(
                                        request.getQuantity()
                                )
                        );

        product.setTotalPrice(totalPrice);
        product.setStatus(ProductStatus.PENDING_APPROVAL);
        product.setCreatedDate(LocalDateTime.now());
        product.setUpdatedDate(LocalDateTime.now());

        Product savedProduct =
                productRepository.save(product);

        Admin admin = adminRepository.findById(1L)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin not found."));

        try {
            emailService.sendNewRequestNotification(
                    admin,
                    savedProduct
            );
        } catch (Exception e) {
            // Email failure should not stop request creation.
        }

        return new RequestResponse<>(
                "Request submitted successfully.",
                mapToProductResponse(savedProduct)
        );
    }


    @Override
    public RequestResponse<List<ProductResponse>> getActionHistory(
            String type,
            Long id) {

        List<Product> products;
        String message;

        if ("user".equalsIgnoreCase(type)) {

            if (id == null) {
                throw new IllegalArgumentException(
                        "User id is required when type is user."
                );
            }

            userRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found."));

            products = productRepository
                    .findByUser_UserIdOrderByCreatedDateDesc(id);

            message =
                    "User request history fetched successfully.";

        } else if ("admin".equalsIgnoreCase(type)) {

            products = productRepository
                    .findByStatusInOrderByUpdatedDateDesc(
                            List.of(
                                    ProductStatus.APPROVED,
                                    ProductStatus.REJECTED
                            )
                    );

            message =
                    "Admin action history fetched successfully.";

        } else {

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


    private List<Product> getProductsForHistory(
            String type,
            Long id) {

        if ("user".equalsIgnoreCase(type)) {

            if (id == null) {
                throw new IllegalArgumentException(
                        "User id is required when type is user."
                );
            }

            userRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found."));

            return productRepository
                    .findByUser_UserIdOrderByCreatedDateDesc(id);
        }

        if ("admin".equalsIgnoreCase(type)) {

            return productRepository
                    .findByStatusInOrderByUpdatedDateDesc(
                            List.of(
                                    ProductStatus.APPROVED,
                                    ProductStatus.REJECTED
                            )
                    );
        }

        throw new IllegalArgumentException(
                "Invalid type. Use user or admin."
        );
    }


    private ProductResponse mapToProductResponse(
            Product product) {

        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
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


    private String escapeCsv(String value) {

        if (value == null) {
            return "";
        }

        if (value.contains(",")
                || value.contains("\"")
                || value.contains("\n")) {

            return "\""
                    + value.replace("\"", "\"\"")
                    + "\"";
        }

        return value;
    }


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
                    "Quantity",
                    "Price Per Product",
                    "Total Price",
                    "Status",
                    "Created Date"
            };

            Row header =
                    sheet.createRow(0);

            for (int i = 0;
                 i < headers.length;
                 i++) {

                header.createCell(i)
                        .setCellValue(headers[i]);
            }

            int rowNumber = 1;

            for (Product product : products) {

                Row row =
                        sheet.createRow(rowNumber++);

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
                                product.getQuantity()
                        );

                row.createCell(6)
                        .setCellValue(
                                product.getPricePerProduct()
                                        .doubleValue()
                        );

                row.createCell(7)
                        .setCellValue(
                                product.getTotalPrice()
                                        .doubleValue()
                        );

                row.createCell(8)
                        .setCellValue(
                                product.getStatus()
                                        .toString()
                        );

                row.createCell(9)
                        .setCellValue(
                                product.getCreatedDate()
                                        .toString()
                        );
            }

            for (int i = 0;
                 i < headers.length;
                 i++) {

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
                    2.5f,
                    1.7f,
                    1.5f,
                    0.7f,
                    1.3f,
                    1.3f,
                    1.5f,
                    2.2f
            };

            PdfPTable table =
                    new PdfPTable(columnWidths);

            table.setWidthPercentage(100);
            table.setSplitRows(true);
            table.setSplitLate(false);
            table.setHeaderRows(1);

            String[] headers = {
                    "ID",
                    "Product",
                    "Department",
                    "Category",
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
                        product.getDepartment()
                                .getDepartmentName()
                );

                table.addCell(
                        product.getCategory()
                                .getCategoryName()
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