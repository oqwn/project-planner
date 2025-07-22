package com.example.projectplanner.service;

import com.example.projectplanner.dto.*;
import com.example.projectplanner.entity.Milestone;
import com.example.projectplanner.entity.TeamAvailability;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private MilestoneMapper milestoneMapper;

    @Autowired
    private TeamAvailabilityMapper teamAvailabilityMapper;

    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private ProjectMemberMapper projectMemberMapper;

    public List<GanttTaskDTO> getGanttData(UUID projectId, String userEmail) {
        // Verify user has access to project
        verifyUserProjectAccess(userEmail, projectId);
        
        // Get tasks and milestones
        List<GanttTaskDTO> tasks = reportMapper.getGanttTasks(projectId);
        List<GanttTaskDTO> milestones = reportMapper.getGanttMilestones(projectId);
        
        // Combine and sort by date
        List<GanttTaskDTO> ganttData = new ArrayList<>();
        ganttData.addAll(tasks);
        ganttData.addAll(milestones);
        
        return ganttData.stream()
                .sorted((a, b) -> {
                    if (a.getStartDate() == null) return 1;
                    if (b.getStartDate() == null) return -1;
                    return a.getStartDate().compareTo(b.getStartDate());
                })
                .collect(Collectors.toList());
    }

    public List<MilestoneDTO> getMilestones(UUID projectId, String userEmail) {
        // Verify user has access to project
        verifyUserProjectAccess(userEmail, projectId);
        
        List<MilestoneDTO> milestones = milestoneMapper.findByProjectId(projectId);
        
        // Calculate completion percentage for each milestone
        for (MilestoneDTO milestone : milestones) {
            if (milestone.getTotalTasks() > 0) {
                int percentage = (milestone.getTasksCompleted() * 100) / milestone.getTotalTasks();
                milestone.setCompletionPercentage(percentage);
            } else {
                milestone.setCompletionPercentage(0);
            }
        }
        
        return milestones;
    }

    @Transactional
    public MilestoneDTO createMilestone(Milestone milestone, String userEmail) {
        // Verify user has access to project
        verifyUserProjectAccess(userEmail, milestone.getProjectId());
        
        milestoneMapper.insert(milestone);
        return milestoneMapper.findById(milestone.getId());
    }

    @Transactional
    public MilestoneDTO updateMilestone(Milestone milestone, String userEmail) {
        // Verify user has access to project
        verifyUserProjectAccess(userEmail, milestone.getProjectId());
        
        // Set updated timestamp
        milestone.setUpdatedAt(OffsetDateTime.now());
        
        milestoneMapper.update(milestone);
        return milestoneMapper.findById(milestone.getId());
    }

    @Transactional
    public void deleteMilestone(UUID milestoneId, String userEmail) {
        // Get milestone to check project access
        MilestoneDTO milestone = milestoneMapper.findById(milestoneId);
        if (milestone != null) {
            verifyUserProjectAccess(userEmail, milestone.getProjectId());
            milestoneMapper.delete(milestoneId);
        }
    }

    public List<WorkloadComparisonDTO> getWorkloadComparison(UUID projectId, String userEmail) {
        // Verify user has access to project
        verifyUserProjectAccess(userEmail, projectId);
        
        List<WorkloadComparisonDTO> workloads = reportMapper.getWorkloadComparison(projectId);
        
        // Get task details for each user
        for (WorkloadComparisonDTO workload : workloads) {
            List<WorkloadComparisonDTO.TaskWorkload> tasks = 
                reportMapper.getUserTaskWorkloads(projectId, workload.getUserId());
            workload.setTasks(tasks);
            
            // Calculate variance percentage
            if (workload.getTotalEstimatedHours() != null && workload.getTotalEstimatedHours() > 0 && 
                workload.getTotalActualHours() != null) {
                double variance = ((double)(workload.getTotalActualHours() - workload.getTotalEstimatedHours()) 
                    / workload.getTotalEstimatedHours()) * 100;
                workload.setVariancePercentage(variance);
            } else {
                workload.setVariancePercentage(0.0);
            }
        }
        
        return workloads;
    }

    public List<TeamAvailabilityDTO> getTeamAvailability(UUID projectId, LocalDate startDate, 
                                                          LocalDate endDate, String userEmail) {
        // Verify user has access to project
        verifyUserProjectAccess(userEmail, projectId);
        
        return teamAvailabilityMapper.findByProjectAndDateRange(projectId, startDate, endDate);
    }

    @Transactional
    public TeamAvailabilityDTO updateAvailability(TeamAvailability availability, String userEmail) {
        // Get user by email
        User user = userMapper.findByEmail(userEmail);
        
        // Users can only update their own availability
        if (!availability.getUserId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own availability");
        }
        
        teamAvailabilityMapper.upsert(availability);
        
        // Return the updated availability
        List<TeamAvailabilityDTO> result = teamAvailabilityMapper.findByUserAndDateRange(
            availability.getUserId(), availability.getDate(), availability.getDate());
        
        return result.isEmpty() ? null : result.get(0);
    }
    
    private void verifyUserProjectAccess(String userEmail, UUID projectId) {
        // Get user by email
        User user = userMapper.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Check if user is a member of the project
        boolean isMember = projectMemberMapper.isMember(projectId, user.getId());
        if (!isMember) {
            throw new RuntimeException("User does not have access to this project");
        }
    }
}