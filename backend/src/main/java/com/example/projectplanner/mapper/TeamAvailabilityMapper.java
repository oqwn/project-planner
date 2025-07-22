package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.TeamAvailability;
import com.example.projectplanner.dto.TeamAvailabilityDTO;
import org.apache.ibatis.annotations.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Mapper
public interface TeamAvailabilityMapper {

    @Insert("INSERT INTO team_availability (id, user_id, date, status, notes) " +
            "VALUES (#{id}, #{userId}, #{date}, #{status}, #{notes}) " +
            "ON CONFLICT (user_id, date) DO UPDATE SET " +
            "status = #{status}, notes = #{notes}")
    void upsert(TeamAvailability availability);

    @Delete("DELETE FROM team_availability WHERE id = #{id}")
    void delete(@Param("id") UUID id);

    @Select("SELECT ta.*, u.name as user_name, u.email as user_email " +
            "FROM team_availability ta " +
            "JOIN users u ON ta.user_id = u.id " +
            "WHERE ta.date >= #{startDate} AND ta.date <= #{endDate} " +
            "ORDER BY ta.date, u.name")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "userEmail", column = "user_email"),
        @Result(property = "date", column = "date"),
        @Result(property = "status", column = "status"),
        @Result(property = "notes", column = "notes")
    })
    List<TeamAvailabilityDTO> findByDateRange(@Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);

    @Select("SELECT ta.*, u.name as user_name, u.email as user_email " +
            "FROM team_availability ta " +
            "JOIN users u ON ta.user_id = u.id " +
            "WHERE ta.user_id = #{userId} AND ta.date >= #{startDate} AND ta.date <= #{endDate} " +
            "ORDER BY ta.date")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "userEmail", column = "user_email"),
        @Result(property = "date", column = "date"),
        @Result(property = "status", column = "status"),
        @Result(property = "notes", column = "notes")
    })
    List<TeamAvailabilityDTO> findByUserAndDateRange(@Param("userId") UUID userId,
                                                      @Param("startDate") LocalDate startDate, 
                                                      @Param("endDate") LocalDate endDate);

    @Select("SELECT ta.*, u.name as user_name, u.email as user_email " +
            "FROM team_availability ta " +
            "JOIN users u ON ta.user_id = u.id " +
            "JOIN project_members pm ON u.id = pm.user_id " +
            "WHERE pm.project_id = #{projectId} AND ta.date >= #{startDate} AND ta.date <= #{endDate} " +
            "ORDER BY ta.date, u.name")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "userName", column = "user_name"),
        @Result(property = "userEmail", column = "user_email"),
        @Result(property = "date", column = "date"),
        @Result(property = "status", column = "status"),
        @Result(property = "notes", column = "notes")
    })
    List<TeamAvailabilityDTO> findByProjectAndDateRange(@Param("projectId") UUID projectId,
                                                         @Param("startDate") LocalDate startDate, 
                                                         @Param("endDate") LocalDate endDate);
}