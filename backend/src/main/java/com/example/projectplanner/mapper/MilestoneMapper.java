package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Milestone;
import com.example.projectplanner.dto.MilestoneDTO;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.UUID;

@Mapper
public interface MilestoneMapper {

    @Insert("INSERT INTO milestones (id, project_id, name, description, target_date, status, created_at, updated_at) " +
            "VALUES (#{id}, #{projectId}, #{name}, #{description}, #{targetDate}, #{status}, #{createdAt}, #{updatedAt})")
    void insert(Milestone milestone);

    @Update("UPDATE milestones SET name = #{name}, description = #{description}, " +
            "target_date = #{targetDate}, status = #{status}, updated_at = #{updatedAt} WHERE id = #{id}")
    void update(Milestone milestone);

    @Delete("DELETE FROM milestones WHERE id = #{id}")
    void delete(@Param("id") UUID id);

    @Select("SELECT m.id, m.project_id, m.name, m.description, m.status, " +
            "m.target_date, m.created_at, m.updated_at, " +
            "p.name as project_name, " +
            "(SELECT COUNT(*) FROM tasks t WHERE t.project_id = m.project_id AND t.status = 'COMPLETED') as tasks_completed, " +
            "(SELECT COUNT(*) FROM tasks t WHERE t.project_id = m.project_id) as total_tasks " +
            "FROM milestones m " +
            "JOIN projects p ON m.project_id = p.id " +
            "WHERE m.id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "projectName", column = "project_name"),
        @Result(property = "name", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "targetDate", column = "target_date"),
        @Result(property = "status", column = "status"),
        @Result(property = "tasksCompleted", column = "tasks_completed"),
        @Result(property = "totalTasks", column = "total_tasks")
    })
    MilestoneDTO findById(@Param("id") UUID id);

    @Select("SELECT m.id, m.project_id, m.name, m.description, m.status, " +
            "m.target_date, m.created_at, m.updated_at, " +
            "p.name as project_name, " +
            "(SELECT COUNT(*) FROM tasks t WHERE t.project_id = m.project_id AND t.status = 'COMPLETED') as tasks_completed, " +
            "(SELECT COUNT(*) FROM tasks t WHERE t.project_id = m.project_id) as total_tasks " +
            "FROM milestones m " +
            "JOIN projects p ON m.project_id = p.id " +
            "WHERE m.project_id = #{projectId} " +
            "ORDER BY m.target_date ASC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "projectName", column = "project_name"),
        @Result(property = "name", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "targetDate", column = "target_date"),
        @Result(property = "status", column = "status"),
        @Result(property = "tasksCompleted", column = "tasks_completed"),
        @Result(property = "totalTasks", column = "total_tasks")
    })
    List<MilestoneDTO> findByProjectId(@Param("projectId") UUID projectId);
}