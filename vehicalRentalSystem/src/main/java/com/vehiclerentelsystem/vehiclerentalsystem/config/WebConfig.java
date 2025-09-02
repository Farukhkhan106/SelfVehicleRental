package com.vehiclerentelsystem.vehiclerentalsystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve images from F:/springBoot/uploads/ via URL /uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///F:/springBoot/uploads/") // make sure 3 slashes
                .setCachePeriod(3600);
    }
}
