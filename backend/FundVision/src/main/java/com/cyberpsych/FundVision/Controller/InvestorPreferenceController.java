package com.cyberpsych.FundVision.Controller;

import com.cyberpsych.FundVision.DTO.InvestorRequest;
import com.cyberpsych.FundVision.Service.InvestorPreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/investor/savepreference")
public class InvestorPreferenceController {
    @Autowired
    private InvestorPreferenceService investorPreferenceService;

    @PostMapping
    public ResponseEntity<String> createPreference(@RequestBody InvestorRequest dto)  {
        investorPreferenceService.savePreference(dto);

        return ResponseEntity.status(HttpStatus.OK)
                .body("Investor preference saved successfully!");
    }
}
