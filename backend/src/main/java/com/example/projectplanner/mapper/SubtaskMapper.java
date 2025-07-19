package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Subtask;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface SubtaskMapper {
    
    @Select("SELECT * FROM subtasks WHERE task_id = #{taskId} ORDER BY created_at ASC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "taskId", column = "task_id"),
        @Result(property = "title", column = "name"),
        @Result(property = "completed", column = "is_completed"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Subtask> findByTaskId(UUID taskId);
    
    @Insert("INSERT INTO subtasks (id, task_id, name, is_completed, created_at) " +
            "VALUES (#{id}, #{taskId}, #{title}, #{completed}, #{createdAt})")
    void insert(Subtask subtask);
    
    @Update("UPDATE subtasks SET " +
            "name = #{title}, " +
            "is_completed = #{completed} " +
            "WHERE id = #{id}")
    void update(Subtask subtask);
    
    @Delete("DELETE FROM subtasks WHERE id = #{id}")
    void deleteById(UUID id);
    
    @Delete("DELETE FROM subtasks WHERE task_id = #{taskId}")
    void deleteByTaskId(UUID taskId);
    
    // Note: Dependencies are handled via depends_on and depends_on_array columns in subtasks table
    // For now, returning empty list since the functionality can be implemented later
    default List<UUID> findDependenciesBySubtaskId(UUID subtaskId) {
        return List.of();
    }
}