package com.cyberpsych.FundVision.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CronRequestController {
    // Accept ping calls
    @GetMapping("/ping")
    public ResponseEntity<String> pingServer() {
        return ResponseEntity.ok("Server in online!");
    }
}
