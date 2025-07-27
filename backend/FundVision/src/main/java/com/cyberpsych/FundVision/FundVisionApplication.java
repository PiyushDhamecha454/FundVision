package com.cyberpsych.FundVision;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})	// remove after adding DB URL
public class FundVisionApplication {

	public static void main(String[] args) {
		SpringApplication.run(FundVisionApplication.class, args);
	}

}
