package com.jobconnect.dto;

import com.jobconnect.entity.Application;
import lombok.Getter;

@Getter
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String candidateName;
    private String candidateEmail;
    private Application.Status status;

    public ApplicationResponse(Application app) {
        this.id = app.getId();
        this.jobId = app.getJob().getId();
        this.jobTitle = app.getJob().getTitle();
        this.company = app.getJob().getCompany();
        this.candidateName = app.getCandidate().getName();
        this.candidateEmail = app.getCandidate().getEmail();
        this.status = app.getStatus();
    }
}