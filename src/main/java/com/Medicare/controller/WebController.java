package com.Medicare.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String redirect() {
        return "forward:/index.html";
    }
}