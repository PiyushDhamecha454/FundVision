package com.cyberpsych.FundVision.DTO;

import com.cyberpsych.FundVision.Enum.InvestmentHorizon;
import com.cyberpsych.FundVision.Enum.RiskAppetite;
import lombok.Data;

import java.util.List;

@Data
public class InvestorRequest {
    private String username;
    private RiskAppetite riskAppetite;
    private InvestmentHorizon investmentHorizon;
    private Double investmentAmount;
    private List<String> preferredFundTypes;
    private List<String> sectorPreferences;
}
