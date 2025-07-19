package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface UserMapper {
    
    @Insert("INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) " +
            "VALUES (#{id}, #{email}, #{name}, #{passwordHash}, #{role}::user_role, #{createdAt}, #{updatedAt})")
    void insert(User user);
    
    @Update("UPDATE users SET email = #{email}, name = #{name}, password_hash = #{passwordHash}, " +
            "role = #{role}::user_role, updated_at = CURRENT_TIMESTAMP WHERE id = #{id}")
    void update(User user);
    
    @Delete("DELETE FROM users WHERE id = #{id}")
    void deleteById(UUID id);
    
    @Select("SELECT id, email, name, password_hash, role, created_at, updated_at FROM users WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "email", column = "email"),
        @Result(property = "name", column = "name"),
        @Result(property = "passwordHash", column = "password_hash"),
        @Result(property = "role", column = "role"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    Optional<User> findById(UUID id);
    
    @Select("SELECT id, email, name, password_hash, role, created_at, updated_at FROM users WHERE email = #{email}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "email", column = "email"),
        @Result(property = "name", column = "name"),
        @Result(property = "passwordHash", column = "password_hash"),
        @Result(property = "role", column = "role"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    Optional<User> findByEmail(String email);
    
    @Select("SELECT id, email, name, password_hash, role, created_at, updated_at FROM users ORDER BY created_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "email", column = "email"),
        @Result(property = "name", column = "name"),
        @Result(property = "passwordHash", column = "password_hash"),
        @Result(property = "role", column = "role"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<User> findAll();
    
    @Select("SELECT id, email, name, password_hash, role, created_at, updated_at FROM users WHERE role = #{role}::user_role ORDER BY created_at DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "email", column = "email"),
        @Result(property = "name", column = "name"),
        @Result(property = "passwordHash", column = "password_hash"),
        @Result(property = "role", column = "role"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<User> findByRole(@Param("role") User.UserRole role);
}