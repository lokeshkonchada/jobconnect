package com.jobconnect.controller;

import com.jobconnect.dto.JobRequest;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.User;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobController(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Public - anyone can browse jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location) {

        List<Job> jobs;
        if (search != null && !search.isBlank()) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(search);
        } else if (location != null && !location.isBlank()) {
            jobs = jobRepository.findByLocationContainingIgnoreCase(location);
        } else {
            jobs = jobRepository.findAll();
        }
        return ResponseEntity.ok(jobs);
    }

    // Public - view single job
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Recruiter only - create job
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> createJob(@Valid @RequestBody JobRequest request, Authentication authentication) {
        User recruiter = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());
        job.setRecruiter(recruiter);

        Job saved = jobRepository.save(job);
        return ResponseEntity.ok(saved);
    }

    // Recruiter only - update own job
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request, Authentication authentication) {
        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        if (!job.getRecruiter().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(403).body("You can only edit your own job postings");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());

        Job updated = jobRepository.save(job);
        return ResponseEntity.ok(updated);
    }

    // Recruiter only - delete own job
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        if (!job.getRecruiter().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(403).body("You can only delete your own job postings");
        }

        jobRepository.delete(job);
        return ResponseEntity.ok("Job deleted successfully");
    }
}