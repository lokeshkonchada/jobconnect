package com.jobconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String company;

    private String location;

    @Positive
    private Double salary;

    private String jobType;
}