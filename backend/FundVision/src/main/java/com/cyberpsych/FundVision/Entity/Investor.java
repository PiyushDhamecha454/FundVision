package com.cyberpsych.FundVision.Entity;

import com.cyberpsych.FundVision.Enum.InvestmentHorizon;
import com.cyberpsych.FundVision.Enum.RiskAppetite;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "investor_profile")
public class Investor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    private String username;

    @Enumerated(EnumType.STRING)
    private RiskAppetite riskAppetite;

    @Enumerated(EnumType.STRING)
    private InvestmentHorizon investmentHorizon;

    private Double investmentAmount;

    @ElementCollection
    private List<String> preferredFundTypes;

    @ElementCollection
    private List<String> sectorPreferences;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}