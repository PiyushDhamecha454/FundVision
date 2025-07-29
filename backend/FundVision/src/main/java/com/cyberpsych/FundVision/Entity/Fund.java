package com.cyberpsych.FundVision.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "mutual_fund_info")
public class Fund {
    @Id
    Long schemeCode;

    private String schemeName;

    private String fundHouse;

    private Double exitLoad;

    private Double expenseRatio;
}
