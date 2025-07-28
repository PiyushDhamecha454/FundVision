package com.cyberpsych.FundVision.Repository;

import com.cyberpsych.FundVision.Entity.Investor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestorRepository extends JpaRepository<Investor, Long> {
}
