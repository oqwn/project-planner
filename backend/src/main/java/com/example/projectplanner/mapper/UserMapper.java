package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface UserMapper {
    
    void insert(User user);
    
    void update(User user);
    
    void deleteById(UUID id);
    
    Optional<User> findById(UUID id);
    
    Optional<User> findByEmail(String email);
    
    List<User> findAll();
    
    List<User> findByRole(@Param("role") User.UserRole role);
}