package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.TaskComment;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface TaskCommentMapper {
    
    @Select("SELECT c.id, c.task_id, c.user_id, c.content, c.mentions, c.created_at AT TIME ZONE 'UTC' as created_at, u.name as author_name " +
            "FROM comments c " +
            "LEFT JOIN users u ON c.user_id = u.id " +
            "WHERE c.task_id = #{taskId} " +
            "ORDER BY c.created_at ASC")
    List<TaskComment> findByTaskId(UUID taskId);
    
    @Select("SELECT c.id, c.task_id, c.user_id, c.content, c.mentions, c.created_at AT TIME ZONE 'UTC' as created_at, u.name as author_name " +
            "FROM comments c " +
            "LEFT JOIN users u ON c.user_id = u.id " +
            "WHERE c.id = #{id}")
    TaskComment findById(UUID id);
    
    @Insert("INSERT INTO comments (id, task_id, user_id, content, mentions, created_at) " +
            "VALUES (#{id}, #{taskId}, #{userId}, #{content}, #{mentions}, #{createdAt})")
    void insert(TaskComment comment);
    
    @Update("UPDATE comments SET content = #{content} WHERE id = #{id}")
    void update(TaskComment comment);
    
    @Delete("DELETE FROM comments WHERE id = #{id}")
    void deleteById(UUID id);
    
    @Delete("DELETE FROM comments WHERE task_id = #{taskId}")
    void deleteByTaskId(UUID taskId);
}