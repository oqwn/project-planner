package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface TaskMapper {
    
    void insert(Task task);
    
    void update(Task task);
    
    void deleteById(UUID id);
    
    Optional<Task> findById(UUID id);
    
    List<Task> findAll();
    
    List<Task> findByProjectId(@Param("projectId") UUID projectId);
    
    List<Task> findByAssigneeId(@Param("assigneeId") UUID assigneeId);
    
    List<Task> findByStatus(@Param("status") Task.TaskStatus status);
    
    List<Task> findByPriority(@Param("priority") Task.TaskPriority priority);
}