package com.example.projectplanner.mapper.typehandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;

import java.sql.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@MappedJdbcTypes(JdbcType.ARRAY)
public class UUIDListTypeHandler extends BaseTypeHandler<List<UUID>> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<UUID> parameter, JdbcType jdbcType) throws SQLException {
        if (parameter != null && !parameter.isEmpty()) {
            String[] uuidStrings = parameter.stream()
                .map(UUID::toString)
                .toArray(String[]::new);
            Array array = ps.getConnection().createArrayOf("uuid", uuidStrings);
            ps.setArray(i, array);
        } else {
            ps.setNull(i, Types.ARRAY);
        }
    }

    @Override
    public List<UUID> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return extractArray(rs.getArray(columnName));
    }

    @Override
    public List<UUID> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return extractArray(rs.getArray(columnIndex));
    }

    @Override
    public List<UUID> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return extractArray(cs.getArray(columnIndex));
    }

    private List<UUID> extractArray(Array array) throws SQLException {
        if (array != null) {
            Object[] result = (Object[]) array.getArray();
            array.free();
            return Arrays.stream(result)
                .map(obj -> UUID.fromString(obj.toString()))
                .collect(Collectors.toList());
        }
        return null;
    }
}