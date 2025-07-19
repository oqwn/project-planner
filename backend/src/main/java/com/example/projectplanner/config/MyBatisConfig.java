package com.example.projectplanner.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.example.projectplanner.mapper")
public class MyBatisConfig {
}