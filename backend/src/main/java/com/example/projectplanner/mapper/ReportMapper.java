package com.example.projectplanner.mapper;

import com.example.projectplanner.dto.GanttTaskDTO;
import com.example.projectplanner.dto.WorkloadComparisonDTO;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ReportMapper {

    @Select("SELECT t.id, t.name as title, t.description, " +
            "t.created_at as start_date, " +
            "CASE WHEN t.due_date IS NOT NULL THEN (t.due_date + INTERVAL '23 hours 59 minutes') AT TIME ZONE 'UTC' ELSE NULL END as end_date, " +
            "t.status, t.assignee_id, u.name as assignee_name, " +
            "CAST(t.estimated_hours AS INTEGER) as estimated_hours, " +
            "CAST(t.actual_hours AS INTEGER) as actual_hours, 'task' as type, " +
            "CASE " +
            "  WHEN t.status = 'COMPLETED' THEN 100 " +
            "  WHEN t.status = 'IN_PROGRESS' THEN 50 " +
            "  ELSE 0 " +
            "END as progress " +
            "FROM tasks t " +
            "LEFT JOIN users u ON t.assignee_id = u.id " +
            "WHERE t.project_id = #{projectId} " +
            "ORDER BY t.created_at, t.due_date")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "title"),
        @Result(property = "description", column = "description"),
        @Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date"),
        @Result(property = "progress", column = "progress"),
        @Result(property = "status", column = "status"),
        @Result(property = "assigneeId", column = "assignee_id"),
        @Result(property = "assigneeName", column = "assignee_name"),
        @Result(property = "type", column = "type"),
        @Result(property = "estimatedHours", column = "estimated_hours"),
        @Result(property = "actualHours", column = "actual_hours")
    })
    List<GanttTaskDTO> getGanttTasks(@Param("projectId") UUID projectId);

    @Select("SELECT m.id, m.name as title, m.description, " +
            "(m.target_date + INTERVAL '12 hours') AT TIME ZONE 'UTC' as start_date, " +
            "(m.target_date + INTERVAL '12 hours') AT TIME ZONE 'UTC' as end_date, " +
            "m.status, 'milestone' as type, " +
            "CASE " +
            "  WHEN m.status = 'COMPLETED' THEN 100 " +
            "  WHEN m.status = 'IN_PROGRESS' THEN 50 " +
            "  ELSE 0 " +
            "END as progress " +
            "FROM milestones m " +
            "WHERE m.project_id = #{projectId} " +
            "ORDER BY m.target_date")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "title"),
        @Result(property = "description", column = "description"),
        @Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date"),
        @Result(property = "progress", column = "progress"),
        @Result(property = "status", column = "status"),
        @Result(property = "type", column = "type")
    })
    List<GanttTaskDTO> getGanttMilestones(@Param("projectId") UUID projectId);

    @Select("SELECT u.id as user_id, u.name as user_name, " +
            "CAST(SUM(t.estimated_hours) AS INTEGER) as total_estimated_hours, " +
            "CAST(SUM(t.actual_hours) AS INTEGER) as total_actual_hours " +
            "FROM users u " +
            "JOIN tasks t ON t.assignee_id = u.id " +
            "WHERE t.project_id = #{projectId} " +
            "GROUP BY u.id, u.name " +
            "ORDER BY u.name")
    @Results({
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "totalEstimatedHours", column = "total_estimated_hours"),
        @Result(property = "totalActualHours", column = "total_actual_hours")
    })
    List<WorkloadComparisonDTO> getWorkloadComparison(@Param("projectId") UUID projectId);

    @Select("SELECT t.id as task_id, t.name as task_title, t.status, " +
            "t.estimated_hours, t.actual_hours, " +
            "(t.actual_hours - t.estimated_hours) as variance " +
            "FROM tasks t " +
            "WHERE t.project_id = #{projectId} AND t.assignee_id = #{userId} " +
            "ORDER BY t.name")
    @Results({
        @Result(property = "taskId", column = "task_id"),
        @Result(property = "taskTitle", column = "task_title"),
        @Result(property = "status", column = "status"),
        @Result(property = "estimatedHours", column = "estimated_hours"),
        @Result(property = "actualHours", column = "actual_hours"),
        @Result(property = "variance", column = "variance")
    })
    List<WorkloadComparisonDTO.TaskWorkload> getUserTaskWorkloads(@Param("projectId") UUID projectId, 
                                                                   @Param("userId") UUID userId);
}