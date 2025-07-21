package com.example.projectplanner.controller;

import com.example.projectplanner.dto.AddProjectMemberRequest;
import com.example.projectplanner.dto.ProjectMemberResponse;
import com.example.projectplanner.entity.ProjectMember;
import com.example.projectplanner.entity.ProjectMember.ProjectMemberRole;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.UserMapper;
import com.example.projectplanner.service.ProjectMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@Tag(name = "Project Members", description = "Manage project team members")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping
    @Operation(summary = "Get all members of a project")
    public ResponseEntity<List<ProjectMemberResponse>> getProjectMembers(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal String userEmail) {
        
        // Check if the current user is a member of the project
        if (!projectMemberService.isProjectMember(projectId, userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<ProjectMember> members = projectMemberService.getProjectMembers(projectId);
        List<ProjectMemberResponse> response = members.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Add a new member to the project")
    public ResponseEntity<ProjectMemberResponse> addProjectMember(
            @PathVariable UUID projectId,
            @RequestBody AddProjectMemberRequest request,
            @AuthenticationPrincipal String userEmail) {
        
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Check if the current user has permission to add members
        if (!projectMemberService.hasPermission(projectId, currentUser.getId(), ProjectMemberRole.PROJECT_MANAGER)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            ProjectMemberRole role = ProjectMemberRole.valueOf(request.getRole());
            ProjectMember member = projectMemberService.addProjectMember(
                    projectId, 
                    request.getUserId(), 
                    role, 
                    currentUser.getId()
            );
            
            // Fetch the complete member info
            List<ProjectMember> members = projectMemberService.getProjectMembers(projectId);
            ProjectMember addedMember = members.stream()
                    .filter(m -> m.getUserId().equals(request.getUserId()))
                    .findFirst()
                    .orElse(member);

            return ResponseEntity.ok(mapToResponse(addedMember));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}/role")
    @Operation(summary = "Update a member's role")
    public ResponseEntity<Void> updateMemberRole(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @RequestParam String newRole,
            @AuthenticationPrincipal String userEmail) {
        
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            ProjectMemberRole role = ProjectMemberRole.valueOf(newRole);
            projectMemberService.updateMemberRole(projectId, userId, role, currentUser.getId());
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Remove a member from the project")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @AuthenticationPrincipal String userEmail) {
        
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            projectMemberService.removeMember(projectId, userId, currentUser.getId());
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available")
    @Operation(summary = "Get users who are not members of the project")
    public ResponseEntity<List<User>> getAvailableUsers(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal String userEmail) {
        
        // Check if the current user is a member
        if (!projectMemberService.isProjectMember(projectId, userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<User> nonMembers = projectMemberService.getNonMembers(projectId);
        return ResponseEntity.ok(nonMembers);
    }

    private ProjectMemberResponse mapToResponse(ProjectMember member) {
        return new ProjectMemberResponse(
                member.getId(),
                member.getUserId(),
                member.getUserName(),
                member.getUserEmail(),
                member.getRole().getDisplayName(),
                member.getJoinedAt(),
                member.isActive()
        );
    }
}