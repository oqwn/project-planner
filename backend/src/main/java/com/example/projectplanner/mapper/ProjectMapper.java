package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface ProjectMapper {
    
    void insert(Project project);
    
    void update(Project project);
    
    void deleteById(UUID id);
    
    Optional<Project> findById(UUID id);
    
    List<Project> findAll();
    
    List<Project> findByCreatedBy(@Param("createdBy") UUID createdBy);
    
    List<Project> findByStatus(@Param("status") Project.ProjectStatus status);
}