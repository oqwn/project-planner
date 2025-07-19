package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Task;
import com.example.projectplanner.entity.DashboardStats;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface TaskMapper {
    
    @Select("SELECT t.*, u.name as assignee_name, c.name as created_by_name " +
            "FROM tasks t " +
            "LEFT JOIN users u ON t.assignee_id = u.id " +
            "LEFT JOIN users c ON t.created_by = c.id " +
            "WHERE t.id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "status", column = "status", typeHandler = com.example.projectplanner.config.TaskStatusTypeHandler.class),
        @Result(property = "priority", column = "priority", typeHandler = com.example.projectplanner.config.TaskPriorityTypeHandler.class),
        @Result(property = "assigneeId", column = "assignee_id"),
        @Result(property = "assigneeName", column = "assignee_name"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "createdBy", column = "created_by"),
        @Result(property = "createdByName", column = "created_by_name"),
        @Result(property = "dueDate", column = "due_date"),
        @Result(property = "estimatedHours", column = "estimated_hours"),
        @Result(property = "actualHours", column = "actual_hours"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    Optional<Task> findById(UUID id);
    
    @Select("SELECT t.*, u.name as assignee_name, c.name as created_by_name " +
            "FROM tasks t " +
            "LEFT JOIN users u ON t.assignee_id = u.id " +
            "LEFT JOIN users c ON t.created_by = c.id " +
            "WHERE t.project_id = #{projectId} " +
            "ORDER BY t.created_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "status", column = "status", typeHandler = com.example.projectplanner.config.TaskStatusTypeHandler.class),
        @Result(property = "priority", column = "priority", typeHandler = com.example.projectplanner.config.TaskPriorityTypeHandler.class),
        @Result(property = "assigneeId", column = "assignee_id"),
        @Result(property = "assigneeName", column = "assignee_name"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "createdBy", column = "created_by"),
        @Result(property = "createdByName", column = "created_by_name"),
        @Result(property = "dueDate", column = "due_date"),
        @Result(property = "estimatedHours", column = "estimated_hours"),
        @Result(property = "actualHours", column = "actual_hours"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Task> findByProjectId(UUID projectId);
    
    @Select("SELECT t.*, u.name as assignee_name, c.name as created_by_name " +
            "FROM tasks t " +
            "LEFT JOIN users u ON t.assignee_id = u.id " +
            "LEFT JOIN users c ON t.created_by = c.id " +
            "WHERE t.assignee_id = #{assigneeId} " +
            "ORDER BY t.due_date ASC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "title", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "status", column = "status", typeHandler = com.example.projectplanner.config.TaskStatusTypeHandler.class),
        @Result(property = "priority", column = "priority", typeHandler = com.example.projectplanner.config.TaskPriorityTypeHandler.class),
        @Result(property = "assigneeId", column = "assignee_id"),
        @Result(property = "assigneeName", column = "assignee_name"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "createdBy", column = "created_by"),
        @Result(property = "createdByName", column = "created_by_name"),
        @Result(property = "dueDate", column = "due_date"),
        @Result(property = "estimatedHours", column = "estimated_hours"),
        @Result(property = "actualHours", column = "actual_hours"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Task> findByAssigneeId(UUID assigneeId);
    
    @Insert("INSERT INTO tasks (id, name, description, status, priority, assignee_id, project_id, " +
            "created_by, due_date, estimated_hours, actual_hours, created_at, updated_at) " +
            "VALUES (#{id}, #{title}, #{description}, #{status}::task_status, #{priority}::task_priority, " +
            "#{assigneeId}, #{projectId}, #{createdBy}, #{dueDate}, #{estimatedHours}, " +
            "#{actualHours}, #{createdAt}, #{updatedAt})")
    void insert(Task task);
    
    @Update("UPDATE tasks SET " +
            "name = #{title}, " +
            "description = #{description}, " +
            "status = #{status}::task_status, " +
            "priority = #{priority}::task_priority, " +
            "assignee_id = #{assigneeId}, " +
            "due_date = #{dueDate}, " +
            "estimated_hours = #{estimatedHours}, " +
            "actual_hours = #{actualHours}, " +
            "updated_at = CURRENT_TIMESTAMP " +
            "WHERE id = #{id}")
    void update(Task task);
    
    @Delete("DELETE FROM tasks WHERE id = #{id}")
    void deleteById(UUID id);
    
    @Select("SELECT * FROM dashboard_stats WHERE project_id = #{projectId}")
    @Results({
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "totalTasks", column = "total_tasks"),
        @Result(property = "inProgressTasks", column = "in_progress_tasks"),
        @Result(property = "completedTasks", column = "completed_tasks"),
        @Result(property = "overdueTasks", column = "overdue_tasks")
    })
    DashboardStats getDashboardStats(UUID projectId);
    
    // Tags are stored in the tasks.tags array column, not in a separate table
    // For now, returning empty list since tags can be retrieved from the main query
    default List<String> findTagsByTaskId(UUID taskId) {
        return List.of();
    }
    
    // Tags will be handled via the tasks.tags column updates
    default void insertTag(UUID id, UUID taskId, String tag) {
        // No-op for now - tags should be updated via the main task update
    }
    
    default void deleteTagsByTaskId(UUID taskId) {
        // No-op for now - tags should be updated via the main task update
    }
}