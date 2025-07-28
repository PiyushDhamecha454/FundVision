package com.cyberpsych.FundVision.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "recommendation_logs")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    String username;

    private LocalDateTime timestamp;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String inputProfileJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String recommendationFundsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String xaiExplanationsJson;
}
