package com.dallas.rent.geolocation;

import com.bedatadriven.jackson.datatype.jts.JtsModule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GeolocationApplication {

	public static void main(String[] args) {
		SpringApplication.run(GeolocationApplication.class, args);
	}

	@Bean
	public JtsModule jtsModule() {
		// This module will provide a Serializer for geometries
		return new JtsModule();
	}

}
