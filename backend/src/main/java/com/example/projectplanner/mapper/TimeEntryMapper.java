package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.TimeEntry;
import com.example.projectplanner.dto.TimeEntryResponse;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.UUID;

@Mapper
public interface TimeEntryMapper {
    
    @Insert("INSERT INTO time_entries (id, task_id, user_id, date, hours, description, created_at) " +
            "VALUES (#{id}, #{taskId}, #{userId}, #{date}, #{hours}, #{description}, #{createdAt})")
    void insert(TimeEntry timeEntry);

    @Select("SELECT te.*, t.name as task_name, u.name as user_name " +
            "FROM time_entries te " +
            "JOIN tasks t ON te.task_id = t.id " +
            "JOIN users u ON te.user_id = u.id " +
            "WHERE te.id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "taskId", column = "task_id"),
        @Result(property = "taskName", column = "task_name"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "date", column = "date"),
        @Result(property = "hours", column = "hours"),
        @Result(property = "description", column = "description"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "created_at")
    })
    TimeEntryResponse findById(@Param("id") UUID id);

    @Select("SELECT te.*, t.name as task_name, u.name as user_name " +
            "FROM time_entries te " +
            "JOIN tasks t ON te.task_id = t.id " +
            "JOIN users u ON te.user_id = u.id " +
            "WHERE t.project_id = #{projectId} " +
            "ORDER BY te.date DESC, te.created_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "taskId", column = "task_id"),
        @Result(property = "taskName", column = "task_name"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "date", column = "date"),
        @Result(property = "hours", column = "hours"),
        @Result(property = "description", column = "description"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "created_at")
    })
    List<TimeEntryResponse> findByProjectId(@Param("projectId") UUID projectId);

    @Select("SELECT te.*, t.name as task_name, u.name as user_name " +
            "FROM time_entries te " +
            "JOIN tasks t ON te.task_id = t.id " +
            "JOIN users u ON te.user_id = u.id " +
            "WHERE te.user_id = #{userId} " +
            "ORDER BY te.date DESC, te.created_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "taskId", column = "task_id"),
        @Result(property = "taskName", column = "task_name"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "date", column = "date"),
        @Result(property = "hours", column = "hours"),
        @Result(property = "description", column = "description"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "created_at")
    })
    List<TimeEntryResponse> findByUserId(@Param("userId") UUID userId);

    @Delete("DELETE FROM time_entries WHERE id = #{id}")
    int deleteById(@Param("id") UUID id);

    @Select("SELECT COUNT(*) > 0 FROM time_entries WHERE id = #{id} AND user_id = #{userId}")
    boolean existsByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);
}