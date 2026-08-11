package com.infosys.procurement.controller;

import com.infosys.procurement.dto.ProductRequest;
import com.infosys.procurement.dto.ProductResponse;
import com.infosys.procurement.dto.RequestResponse;
import com.infosys.procurement.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;


    @PostMapping("/request")
    public RequestResponse<ProductResponse> raiseRequest(
            @Valid @RequestBody ProductRequest request) {

        return productService.raiseRequest(request);
    }


    @GetMapping("/history")
    public ResponseEntity<?> getActionHistory(
            @RequestParam String type,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String format) {

        // Return request history as JSON
        if (format == null || format.isBlank()) {

            return ResponseEntity.ok(
                    productService.getActionHistory(
                            type,
                            id
                    )
            );
        }


        // Download request history
        byte[] file =
                productService.downloadActionHistory(
                        type,
                        id,
                        format
                );

        String fileName;
        MediaType mediaType;

        switch (format.toLowerCase()) {

            case "csv":

                fileName =
                        "procurement-request-history.csv";

                mediaType =
                        MediaType.parseMediaType(
                                "text/csv"
                        );

                break;


            case "xlsx":
            case "excel":

                fileName =
                        "procurement-request-history.xlsx";

                mediaType =
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        );

                break;


            case "pdf":

                fileName =
                        "procurement-request-history.pdf";

                mediaType =
                        MediaType.APPLICATION_PDF;

                break;


            default:

                throw new IllegalArgumentException(
                        "Invalid format. Use csv, xlsx or pdf."
                );
        }


        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + fileName
                                + "\""
                )
                .contentType(mediaType)
                .body(file);
    }
}