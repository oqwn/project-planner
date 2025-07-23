package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.Meeting;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MeetingMapper {
    
    void insert(Meeting meeting);
    
    Meeting findById(String id);
    
    Meeting findByCode(String code);
    
    List<Meeting> findByProjectId(String projectId);
    
    List<Meeting> findByHostId(String userId);
    
    void updateStatus(@Param("id") String id, @Param("status") String status);
    
    void delete(String id);
}