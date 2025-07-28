package com.cyberpsych.FundVision.Repository;

import com.cyberpsych.FundVision.Entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
}
