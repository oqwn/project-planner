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
        ps.setString(i, parameter.getValue());
    }

    @Override
    public Task.TaskStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value != null ? Task.TaskStatus.fromValue(value) : null;
    }

    @Override
    public Task.TaskStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value != null ? Task.TaskStatus.fromValue(value) : null;
    }

    @Override
    public Task.TaskStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value != null ? Task.TaskStatus.fromValue(value) : null;
    }
}