package com.example.projectplanner.mapper.typehandler;

import com.example.projectplanner.entity.ChatMessage.MessageType;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.*;

@MappedTypes(MessageType.class)
public class MessageTypeTypeHandler extends BaseTypeHandler<MessageType> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, MessageType parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, parameter.name(), Types.OTHER);
    }

    @Override
    public MessageType getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String type = rs.getString(columnName);
        return type == null ? null : MessageType.valueOf(type);
    }

    @Override
    public MessageType getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String type = rs.getString(columnIndex);
        return type == null ? null : MessageType.valueOf(type);
    }

    @Override
    public MessageType getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String type = cs.getString(columnIndex);
        return type == null ? null : MessageType.valueOf(type);
    }
}