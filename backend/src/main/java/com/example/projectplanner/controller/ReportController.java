package com.example.projectplanner.controller;

import com.example.projectplanner.dto.*;
import com.example.projectplanner.entity.Milestone;
import com.example.projectplanner.entity.TeamAvailability;
import com.example.projectplanner.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/gantt")
    public ResponseEntity<List<GanttTaskDTO>> getGanttData(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal String userEmail) {
        List<GanttTaskDTO> ganttData = reportService.getGanttData(projectId, userEmail);
        return ResponseEntity.ok(ganttData);
    }

    @GetMapping("/milestones")
    public ResponseEntity<List<MilestoneDTO>> getMilestones(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal String userEmail) {
        List<MilestoneDTO> milestones = reportService.getMilestones(projectId, userEmail);
        return ResponseEntity.ok(milestones);
    }

    @PostMapping("/milestones")
    public ResponseEntity<MilestoneDTO> createMilestone(
            @PathVariable UUID projectId,
            @RequestBody Milestone milestone,
            @AuthenticationPrincipal String userEmail) {
        milestone.setProjectId(projectId);
        MilestoneDTO created = reportService.createMilestone(milestone, userEmail);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/milestones/{milestoneId}")
    public ResponseEntity<MilestoneDTO> updateMilestone(
            @PathVariable UUID projectId,
            @PathVariable UUID milestoneId,
            @RequestBody Milestone milestone,
            @AuthenticationPrincipal String userEmail) {
        milestone.setId(milestoneId);
        milestone.setProjectId(projectId);
        MilestoneDTO updated = reportService.updateMilestone(milestone, userEmail);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/milestones/{milestoneId}")
    public ResponseEntity<Void> deleteMilestone(
            @PathVariable UUID projectId,
            @PathVariable UUID milestoneId,
            @AuthenticationPrincipal String userEmail) {
        reportService.deleteMilestone(milestoneId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/workload")
    public ResponseEntity<List<WorkloadComparisonDTO>> getWorkloadComparison(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal String userEmail) {
        List<WorkloadComparisonDTO> workload = reportService.getWorkloadComparison(projectId, userEmail);
        return ResponseEntity.ok(workload);
    }

    @GetMapping("/team-availability")
    public ResponseEntity<List<TeamAvailabilityDTO>> getTeamAvailability(
            @PathVariable UUID projectId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal String userEmail) {
        List<TeamAvailabilityDTO> availability = reportService.getTeamAvailability(projectId, startDate, endDate, userEmail);
        return ResponseEntity.ok(availability);
    }

    @PostMapping("/team-availability")
    public ResponseEntity<TeamAvailabilityDTO> updateAvailability(
            @PathVariable UUID projectId,
            @RequestBody TeamAvailability availability,
            @AuthenticationPrincipal String userEmail) {
        TeamAvailabilityDTO updated = reportService.updateAvailability(availability, userEmail);
        return ResponseEntity.ok(updated);
    }
}