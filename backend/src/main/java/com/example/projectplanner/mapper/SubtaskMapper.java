package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Subtask;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface SubtaskMapper {
    
    @Select("SELECT * FROM subtasks WHERE task_id = #{taskId} ORDER BY position ASC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "taskId", column = "task_id"),
        @Result(property = "title", column = "title"),
        @Result(property = "completed", column = "completed"),
        @Result(property = "position", column = "position"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Subtask> findByTaskId(UUID taskId);
    
    @Insert("INSERT INTO subtasks (id, task_id, title, completed, position, created_at, updated_at) " +
            "VALUES (#{id}, #{taskId}, #{title}, #{completed}, #{position}, #{createdAt}, #{updatedAt})")
    void insert(Subtask subtask);
    
    @Update("UPDATE subtasks SET " +
            "title = #{title}, " +
            "completed = #{completed}, " +
            "position = #{position}, " +
            "updated_at = CURRENT_TIMESTAMP " +
            "WHERE id = #{id}")
    void update(Subtask subtask);
    
    @Delete("DELETE FROM subtasks WHERE id = #{id}")
    void deleteById(UUID id);
    
    @Delete("DELETE FROM subtasks WHERE task_id = #{taskId}")
    void deleteByTaskId(UUID taskId);
    
    // Get dependencies for a subtask
    @Select("SELECT depends_on_id FROM subtask_dependencies WHERE subtask_id = #{subtaskId}")
    List<UUID> findDependenciesBySubtaskId(UUID subtaskId);
    
    @Insert("INSERT INTO subtask_dependencies (id, subtask_id, depends_on_id) " +
            "VALUES (#{id}, #{subtaskId}, #{dependsOnId})")
    void insertDependency(@Param("id") UUID id, @Param("subtaskId") UUID subtaskId, @Param("dependsOnId") UUID dependsOnId);
    
    @Delete("DELETE FROM subtask_dependencies WHERE subtask_id = #{subtaskId}")
    void deleteDependenciesBySubtaskId(UUID subtaskId);
}