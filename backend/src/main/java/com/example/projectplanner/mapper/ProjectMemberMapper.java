package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.ProjectMember;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ProjectMemberMapper {

    @Insert("INSERT INTO project_members (id, project_id, user_id, role, joined_at, invited_by, is_active) " +
            "VALUES (#{id}, #{projectId}, #{userId}, #{role}, #{joinedAt}, #{invitedBy}, #{isActive})")
    void insert(ProjectMember projectMember);

    @Select("SELECT pm.*, u.name as user_name, u.email as user_email, p.name as project_name " +
            "FROM project_members pm " +
            "JOIN users u ON pm.user_id = u.id " +
            "JOIN projects p ON pm.project_id = p.id " +
            "WHERE pm.project_id = #{projectId} AND pm.is_active = true " +
            "ORDER BY pm.role, u.name")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "role", column = "role"),
        @Result(property = "joinedAt", column = "joined_at"),
        @Result(property = "invitedBy", column = "invited_by"),
        @Result(property = "isActive", column = "is_active"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "userEmail", column = "user_email"),
        @Result(property = "projectName", column = "project_name")
    })
    List<ProjectMember> findByProjectId(@Param("projectId") UUID projectId);

    @Select("SELECT pm.*, u.name as user_name, u.email as user_email, p.name as project_name " +
            "FROM project_members pm " +
            "JOIN users u ON pm.user_id = u.id " +
            "JOIN projects p ON pm.project_id = p.id " +
            "WHERE pm.user_id = #{userId} AND pm.is_active = true " +
            "ORDER BY p.name")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "role", column = "role"),
        @Result(property = "joinedAt", column = "joined_at"),
        @Result(property = "invitedBy", column = "invited_by"),
        @Result(property = "isActive", column = "is_active"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "userEmail", column = "user_email"),
        @Result(property = "projectName", column = "project_name")
    })
    List<ProjectMember> findByUserId(@Param("userId") UUID userId);

    @Select("SELECT EXISTS(SELECT 1 FROM project_members " +
            "WHERE project_id = #{projectId} AND user_id = #{userId} AND is_active = true)")
    boolean isMember(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

    @Select("SELECT role FROM project_members " +
            "WHERE project_id = #{projectId} AND user_id = #{userId} AND is_active = true")
    String getUserRole(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

    @Update("UPDATE project_members SET role = #{role} " +
            "WHERE project_id = #{projectId} AND user_id = #{userId}")
    void updateMemberRole(@Param("projectId") UUID projectId, 
                         @Param("userId") UUID userId, 
                         @Param("role") String role);

    @Update("UPDATE project_members SET is_active = false " +
            "WHERE project_id = #{projectId} AND user_id = #{userId}")
    void removeMember(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

    @Delete("DELETE FROM project_members WHERE project_id = #{projectId} AND user_id = #{userId}")
    void deleteMember(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

    @Select("SELECT COUNT(*) FROM project_members WHERE project_id = #{projectId} AND is_active = true")
    int countActiveMembers(@Param("projectId") UUID projectId);

    @Select("SELECT u.* FROM users u " +
            "WHERE u.id NOT IN (SELECT user_id FROM project_members " +
            "WHERE project_id = #{projectId} AND is_active = true)")
    List<com.example.projectplanner.entity.User> findNonMembers(@Param("projectId") UUID projectId);
}