package com.example.projectplanner.config;

import com.example.projectplanner.entity.Task;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(Task.TaskPriority.class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class TaskPriorityTypeHandler extends BaseTypeHandler<Task.TaskPriority> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Task.TaskPriority parameter, JdbcType jdbcType) throws SQLException {
        // Map Java enum to database enum
        String dbValue = mapToDbValue(parameter);
        ps.setString(i, dbValue);
    }
    
    private String mapToDbValue(Task.TaskPriority priority) {
        switch (priority) {
            case HIGH: return "HIGH";
            case MEDIUM: return "MEDIUM";
            case LOW: return "LOW";
            default: return "MEDIUM";
        }
    }

    @Override
    public Task.TaskPriority getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value != null ? mapFromDbValue(value) : null;
    }

    @Override
    public Task.TaskPriority getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value != null ? mapFromDbValue(value) : null;
    }

    @Override
    public Task.TaskPriority getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value != null ? mapFromDbValue(value) : null;
    }
    
    private Task.TaskPriority mapFromDbValue(String dbValue) {
        switch (dbValue) {
            case "HIGH": return Task.TaskPriority.HIGH;
            case "MEDIUM": return Task.TaskPriority.MEDIUM;
            case "LOW": return Task.TaskPriority.LOW;
            default: return Task.TaskPriority.MEDIUM;
        }
    }
}