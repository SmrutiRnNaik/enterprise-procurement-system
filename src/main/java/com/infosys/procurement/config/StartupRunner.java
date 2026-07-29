package com.infosys.procurement.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class StartupRunner implements CommandLineRunner {

    private final DataSource dataSource;

    public StartupRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {

        try (Connection connection = dataSource.getConnection()) {

            System.out.println();
            System.out.println("==================================================");
            System.out.println(" Database Connection Successful");
            System.out.println(" Database : " + connection.getCatalog());
            System.out.println(" URL      : " + connection.getMetaData().getURL());
            System.out.println(" User     : " + connection.getMetaData().getUserName());
            System.out.println("==================================================");
            System.out.println();

        }
    }
}