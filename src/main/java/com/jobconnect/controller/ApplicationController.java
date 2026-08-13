package com.jobconnect.controller;

import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.StatusUpdateRequest;
import com.jobconnect.entity.Application;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.User;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationController(ApplicationRepository applicationRepository,
                                  JobRepository jobRepository,
                                  UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Candidate applies to a job
    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> applyToJob(@PathVariable Long jobId, Authentication authentication) {
        User candidate = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Job job = jobRepository.findById(jobId)
                .orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            return ResponseEntity.badRequest().body("You have already applied to this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setStatus(Application.Status.APPLIED);

        Application saved = applicationRepository.save(application);
        return ResponseEntity.ok(new ApplicationResponse(saved));
    }

    // Candidate views their own applications
    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        User candidate = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        List<ApplicationResponse> applications = applicationRepository.findByCandidateId(candidate.getId())
                .stream()
                .map(ApplicationResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(applications);
    }

    // Recruiter views applicants for a specific job
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getApplicantsForJob(@PathVariable Long jobId, Authentication authentication) {
        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        if (!job.getRecruiter().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(403).body("You can only view applicants for your own job postings");
        }

        List<ApplicationResponse> applicants = applicationRepository.findByJobId(jobId)
                .stream()
                .map(ApplicationResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(applicants);
    }

    // Recruiter updates an applicant's status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                           @RequestBody StatusUpdateRequest request,
                                           Authentication authentication) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application == null) {
            return ResponseEntity.notFound().build();
        }

        if (!application.getJob().getRecruiter().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(403).body("You can only update applicants for your own job postings");
        }

        application.setStatus(request.getStatus());
        Application updated = applicationRepository.save(application);
        return ResponseEntity.ok(new ApplicationResponse(updated));
    }
}