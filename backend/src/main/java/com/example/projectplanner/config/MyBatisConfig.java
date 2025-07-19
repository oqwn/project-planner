package com.example.projectplanner.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandlerRegistry;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.example.projectplanner.entity.Task;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.UUID;

@Configuration
@MapperScan("com.example.projectplanner.mapper")
public class MyBatisConfig {

    @Autowired
    private SqlSessionFactory sqlSessionFactory;

    @PostConstruct
    public void registerTypeHandlers() {
        TypeHandlerRegistry typeHandlerRegistry = sqlSessionFactory.getConfiguration().getTypeHandlerRegistry();
        typeHandlerRegistry.register(UUID.class, new UUIDTypeHandler());
        typeHandlerRegistry.register(List.class, new PostgreSQLArrayTypeHandler());
        typeHandlerRegistry.register(Task.TaskStatus.class, new TaskStatusTypeHandler());
        typeHandlerRegistry.register(Task.TaskPriority.class, new TaskPriorityTypeHandler());
    }
}