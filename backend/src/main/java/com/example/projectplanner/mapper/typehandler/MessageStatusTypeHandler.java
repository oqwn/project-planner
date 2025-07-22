package com.example.projectplanner.mapper.typehandler;

import com.example.projectplanner.entity.ChatMessage.MessageStatus;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.*;

@MappedTypes(MessageStatus.class)
public class MessageStatusTypeHandler extends BaseTypeHandler<MessageStatus> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, MessageStatus parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, parameter.name(), Types.OTHER);
    }

    @Override
    public MessageStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String status = rs.getString(columnName);
        return status == null ? null : MessageStatus.valueOf(status);
    }

    @Override
    public MessageStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String status = rs.getString(columnIndex);
        return status == null ? null : MessageStatus.valueOf(status);
    }

    @Override
    public MessageStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String status = cs.getString(columnIndex);
        return status == null ? null : MessageStatus.valueOf(status);
    }
}