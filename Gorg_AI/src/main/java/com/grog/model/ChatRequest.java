package com.grog.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    private String model = "llama-3.3-70b-versatile";
    private List<Message> messages;
    private double temperature = 0.1;
    private int max_tokens = 1000;
    private boolean stream = false;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
