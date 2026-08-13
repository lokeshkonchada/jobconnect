package com.jobconnect.controller;

import com.jobconnect.entity.Job;
import com.jobconnect.entity.SavedJob;
import com.jobconnect.entity.User;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.SavedJobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@PreAuthorize("hasRole('CANDIDATE')")
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public SavedJobController(SavedJobRepository savedJobRepository,
                               JobRepository jobRepository,
                               UserRepository userRepository) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId, Authentication authentication) {
        User candidate = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        if (savedJobRepository.findByJobIdAndCandidateId(jobId, candidate.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Job already saved");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setJob(job);
        savedJob.setCandidate(candidate);
        savedJobRepository.save(savedJob);

        return ResponseEntity.ok("Job saved successfully");
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> getSavedJobs(Authentication authentication) {
        User candidate = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        return ResponseEntity.ok(savedJobRepository.findByCandidateId(candidate.getId()));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long jobId, Authentication authentication) {
        User candidate = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        savedJobRepository.deleteByJobIdAndCandidateId(jobId, candidate.getId());
        return ResponseEntity.ok("Job removed from saved list");
    }
}