package com.example.projectplanner.mapper.typehandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;

import java.sql.*;
import java.util.Arrays;
import java.util.List;

@MappedJdbcTypes(JdbcType.ARRAY)
public class StringListTypeHandler extends BaseTypeHandler<List<String>> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<String> parameter, JdbcType jdbcType) throws SQLException {
        if (parameter != null && !parameter.isEmpty()) {
            Array array = ps.getConnection().createArrayOf("text", parameter.toArray(new String[0]));
            ps.setArray(i, array);
        } else {
            ps.setNull(i, Types.ARRAY);
        }
    }

    @Override
    public List<String> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return extractArray(rs.getArray(columnName));
    }

    @Override
    public List<String> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return extractArray(rs.getArray(columnIndex));
    }

    @Override
    public List<String> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return extractArray(cs.getArray(columnIndex));
    }

    private List<String> extractArray(Array array) throws SQLException {
        if (array != null) {
            String[] result = (String[]) array.getArray();
            array.free();
            return Arrays.asList(result);
        }
        return null;
    }
}