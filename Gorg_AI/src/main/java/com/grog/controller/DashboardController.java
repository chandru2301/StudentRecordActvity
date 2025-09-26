package com.grog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Student & Faculty Dashboard Login Assistant");
        return "index";
    }
    
    @GetMapping("/chat")
    public String chat(Model model) {
        model.addAttribute("title", "Chatbot - Dashboard Login Support");
        return "chat";
    }
}
