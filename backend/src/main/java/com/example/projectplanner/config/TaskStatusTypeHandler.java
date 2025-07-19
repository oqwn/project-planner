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

@MappedTypes(Task.TaskStatus.class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class TaskStatusTypeHandler extends BaseTypeHandler<Task.TaskStatus> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Task.TaskStatus parameter, JdbcType jdbcType) throws SQLException {
        // Map Java enum to database enum
        String dbValue = mapToDbValue(parameter);
        ps.setString(i, dbValue);
    }
    
    private String mapToDbValue(Task.TaskStatus status) {
        switch (status) {
            case TODO: return "TODO";
            case IN_PROGRESS: return "IN_PROGRESS";
            case COMPLETED: return "COMPLETED";
            case PARKED: return "PARKED";
            default: return "TODO";
        }
    }

    @Override
    public Task.TaskStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value != null ? mapFromDbValue(value) : null;
    }

    @Override
    public Task.TaskStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value != null ? mapFromDbValue(value) : null;
    }

    @Override
    public Task.TaskStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value != null ? mapFromDbValue(value) : null;
    }
    
    private Task.TaskStatus mapFromDbValue(String dbValue) {
        switch (dbValue) {
            case "TODO": return Task.TaskStatus.TODO;
            case "IN_PROGRESS": return Task.TaskStatus.IN_PROGRESS;
            case "COMPLETED": return Task.TaskStatus.COMPLETED;
            case "PARKED": return Task.TaskStatus.PARKED;
            default: return Task.TaskStatus.TODO;
        }
    }
}