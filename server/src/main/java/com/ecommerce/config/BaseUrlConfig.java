package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BaseUrlConfig {

    @Value("${baseurl.frontend}")
    private String frontendBaseUrl;

    @Value("${baseurl.backend}")
    private String backendBaseUrl;

    @Bean
    @Qualifier("frontendBaseUrl")
    public String getFrontendBaseUrl() {
        return frontendBaseUrl;
    }

    @Bean
    @Qualifier("backendBaseUrl")
    public String getBackendBaseUrl() {
        return backendBaseUrl;
    }

}
