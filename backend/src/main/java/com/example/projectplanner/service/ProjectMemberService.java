package com.example.projectplanner.service;

import com.example.projectplanner.entity.ProjectMember;
import com.example.projectplanner.entity.ProjectMember.ProjectMemberRole;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.ProjectMemberMapper;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectMemberService {

    @Autowired
    private ProjectMemberMapper projectMemberMapper;

    @Autowired
    private UserMapper userMapper;

    public List<ProjectMember> getProjectMembers(UUID projectId) {
        return projectMemberMapper.findByProjectId(projectId);
    }

    public List<ProjectMember> getUserProjects(UUID userId) {
        return projectMemberMapper.findByUserId(userId);
    }

    public boolean isProjectMember(UUID projectId, UUID userId) {
        return projectMemberMapper.isMember(projectId, userId);
    }

    public boolean isProjectMember(UUID projectId, String userEmail) {
        User user = userMapper.findByEmail(userEmail);
        if (user == null) {
            return false;
        }
        return projectMemberMapper.isMember(projectId, user.getId());
    }

    public String getUserRole(UUID projectId, UUID userId) {
        return projectMemberMapper.getUserRole(projectId, userId);
    }

    public boolean hasPermission(UUID projectId, UUID userId, ProjectMemberRole requiredRole) {
        String userRole = getUserRole(projectId, userId);
        if (userRole == null) {
            return false;
        }
        
        ProjectMemberRole currentRole = ProjectMemberRole.valueOf(userRole);
        
        // PROJECT_OWNER has all permissions
        if (currentRole == ProjectMemberRole.PROJECT_OWNER) {
            return true;
        }
        
        // PROJECT_MANAGER can do everything except owner-specific actions
        if (currentRole == ProjectMemberRole.PROJECT_MANAGER && 
            requiredRole != ProjectMemberRole.PROJECT_OWNER) {
            return true;
        }
        
        // MEMBER can do member-level actions
        if (currentRole == ProjectMemberRole.MEMBER && 
            (requiredRole == ProjectMemberRole.MEMBER || requiredRole == ProjectMemberRole.VIEWER)) {
            return true;
        }
        
        // VIEWER can only view
        return currentRole == ProjectMemberRole.VIEWER && requiredRole == ProjectMemberRole.VIEWER;
    }

    @Transactional
    public ProjectMember addProjectMember(UUID projectId, UUID userId, ProjectMemberRole role, UUID invitedBy) {
        // Check if already a member
        if (projectMemberMapper.isMember(projectId, userId)) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember(projectId, userId, role);
        member.setInvitedBy(invitedBy);
        projectMemberMapper.insert(member);
        
        return member;
    }

    @Transactional
    public void updateMemberRole(UUID projectId, UUID userId, ProjectMemberRole newRole, UUID updatedBy) {
        // Check if the user making the change has permission
        if (!hasPermission(projectId, updatedBy, ProjectMemberRole.PROJECT_MANAGER)) {
            throw new SecurityException("Insufficient permissions to update member role");
        }
        
        // Can't change the role of the project owner
        String currentRole = getUserRole(projectId, userId);
        if (ProjectMemberRole.PROJECT_OWNER.name().equals(currentRole)) {
            throw new IllegalArgumentException("Cannot change the role of the project owner");
        }
        
        projectMemberMapper.updateMemberRole(projectId, userId, newRole.name());
    }

    @Transactional
    public void removeMember(UUID projectId, UUID userId, UUID removedBy) {
        // Check permissions
        if (!hasPermission(projectId, removedBy, ProjectMemberRole.PROJECT_MANAGER)) {
            throw new SecurityException("Insufficient permissions to remove member");
        }
        
        // Can't remove the project owner
        String role = getUserRole(projectId, userId);
        if (ProjectMemberRole.PROJECT_OWNER.name().equals(role)) {
            throw new IllegalArgumentException("Cannot remove the project owner");
        }
        
        // Soft delete (set is_active = false)
        projectMemberMapper.removeMember(projectId, userId);
    }

    public List<User> getNonMembers(UUID projectId) {
        return projectMemberMapper.findNonMembers(projectId);
    }

    public int getActiveMemberCount(UUID projectId) {
        return projectMemberMapper.countActiveMembers(projectId);
    }
}