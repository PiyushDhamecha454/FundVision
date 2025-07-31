package com.cyberpsych.FundVision.Service;

import com.cyberpsych.FundVision.DTO.InvestorRequest;
import com.cyberpsych.FundVision.Entity.Investor;
import com.cyberpsych.FundVision.Repository.InvestorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvestorPreferenceService {
    @Autowired
    private InvestorRepository investorRepository;

    public InvestorPreferenceService(InvestorRepository investorRepository) {
        this.investorRepository = investorRepository;
    }

    public Investor savePreference(InvestorRequest investorRequest) {
        Investor preference = new Investor();
        preference.setUsername(investorRequest.getUsername());
        preference.setSectorPreferences(investorRequest.getSectorPreferences());
        preference.setRiskAppetite(investorRequest.getRiskAppetite());
        preference.setInvestmentHorizon(investorRequest.getInvestmentHorizon());
        preference.setInvestmentAmount(investorRequest.getInvestmentAmount());
        preference.setPreferredFundTypes(investorRequest.getPreferredFundTypes());

        return investorRepository.save(preference);
    }
}
