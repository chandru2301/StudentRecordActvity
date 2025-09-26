package com.grog.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "grog.ai")
@Data
public class GrogAiConfig {
    
    private String apiKey;
    private String apiUrl;
}
