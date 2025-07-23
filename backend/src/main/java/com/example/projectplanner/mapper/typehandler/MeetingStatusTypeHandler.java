package com.example.projectplanner.mapper.typehandler;

import com.example.projectplanner.entity.Meeting;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(Meeting.MeetingStatus.class)
public class MeetingStatusTypeHandler extends BaseTypeHandler<Meeting.MeetingStatus> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Meeting.MeetingStatus parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.getValue());
    }

    @Override
    public Meeting.MeetingStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : Meeting.MeetingStatus.valueOf(value.toUpperCase());
    }

    @Override
    public Meeting.MeetingStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : Meeting.MeetingStatus.valueOf(value.toUpperCase());
    }

    @Override
    public Meeting.MeetingStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : Meeting.MeetingStatus.valueOf(value.toUpperCase());
    }
}