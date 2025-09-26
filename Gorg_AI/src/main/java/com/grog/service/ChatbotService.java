package com.grog.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grog.model.ChatRequest;
import com.grog.model.ChatResponse;
import com.grog.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class ChatbotService {
    
    @Value("${grog.ai.api.key}")
    private String apiKey;
    
    @Value("${grog.ai.api.url}")
    private String apiUrl;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public ChatbotService(@Value("${grog.ai.api.key}") String apiKey, @Value("${grog.ai.api.url}") String apiUrl) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        log.info("Grog AI Config - API Key: {}", apiKey != null ? "***" + apiKey.substring(apiKey.length() - 4) : "NULL");
        log.info("Grog AI Config - API URL: {}", apiUrl);
        
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public String getChatResponse(String userMessage) {
        try {
            // Create system message to ensure specific answers for student/faculty dashboard logins
            String systemPrompt = "You are a specialized chatbot assistant for student and faculty dashboard login support. " +
                    "You ONLY provide specific, concise answers related to: " +
                    "1. Student dashboard login issues and solutions " +
                    "2. Faculty dashboard login problems and fixes " +
                    "3. Password reset procedures " +
                    "4. Account access troubleshooting " +
                    "5. Dashboard navigation help " +
                    "6. Technical support for educational platform access " +
                    "For any questions outside these topics, politely redirect users to contact their IT support or help desk. " +
                    "Keep responses brief, specific, and actionable.";
            
            List<ChatRequest.Message> messages = new ArrayList<>();
            messages.add(new ChatRequest.Message("system", systemPrompt));
            messages.add(new ChatRequest.Message("user", userMessage));
            
            ChatRequest request = new ChatRequest();
            request.setMessages(messages);
            request.setTemperature(0.1); // Low temperature for more focused responses
            request.setMax_tokens(500); // Limit response length for specificity
            
            log.info("Sending request to Grog AI: {}", userMessage);
            log.info("Using API URL: {}", apiUrl + "/chat/completions");
            
            ChatResponse response = webClient.post()
                    .uri(apiUrl + "/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ChatResponse.class)
                    .block();
            
            if (response != null && !response.getChoices().isEmpty()) {
                String aiResponse = response.getChoices().get(0).getMessage().getContent();
                log.info("Received response from Grog AI: {}", aiResponse);
                return aiResponse;
            } else {
                log.error("No response received from Grog AI");
                return "I'm sorry, I'm having trouble connecting to the AI service. Please try again later or contact your IT support.";
            }
            
        } catch (Exception e) {
            log.error("Error calling Grog AI API", e);
            return "I'm experiencing technical difficulties. Please contact your IT support for immediate assistance with your dashboard login issues.";
        }
    }
    
    public List<ChatMessage> getChatHistory() {
        // In a real application, this would retrieve from a database
        // For now, return a sample conversation
        return Arrays.asList(
                new ChatMessage("assistant", "Hello! I'm here to help with student and faculty dashboard login issues. How can I assist you today?"),
                new ChatMessage("user", "I can't log into my student dashboard"),
                new ChatMessage("assistant", "Let me help you troubleshoot your student dashboard login. Please try these steps: 1) Clear your browser cache and cookies, 2) Ensure you're using the correct student ID and password, 3) Check if your account is active. If the issue persists, contact your school's IT support.")
        );
    }
}
