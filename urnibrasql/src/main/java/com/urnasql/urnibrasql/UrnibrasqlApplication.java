package com.urnasql.urnibrasql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.urnasql.repository")
@EntityScan(basePackages = "com.urnasql.model")
@ComponentScan(basePackages = "com.urnasql")
public class UrnibrasqlApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrnibrasqlApplication.class, args);
	}

}
