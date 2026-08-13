package com.jobconnect.repository;

import com.jobconnect.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByCandidateId(Long candidateId);
    Optional<SavedJob> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    void deleteByJobIdAndCandidateId(Long jobId, Long candidateId);
}