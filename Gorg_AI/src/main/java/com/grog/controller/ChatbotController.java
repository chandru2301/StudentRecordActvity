package com.grog.controller;
import com.grog.model.ChatMessage;
import com.grog.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatbotController {
    
    private final ChatbotService chatbotService;
    
    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Message cannot be empty"));
            }
            
            log.info("Received message: {}", userMessage);
            String response = chatbotService.getChatResponse(userMessage);
            
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("response", response);
            responseMap.put("status", "success");
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            log.error("Error processing chat message", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process message. Please try again."));
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory() {
        try {
            List<ChatMessage> history = chatbotService.getChatHistory();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error retrieving chat history", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Chatbot Service");
        health.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(health);
    }
}
