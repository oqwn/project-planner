package com.example.projectplanner.mapper;

import com.example.projectplanner.entity.SharedFile;
import com.example.projectplanner.dto.SharedFileResponse;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface SharedFileMapper {

    @Insert("INSERT INTO shared_files (id, project_id, uploaded_by, file_name, original_file_name, file_type, file_size, file_path, file_url, uploaded_at, is_deleted) " +
            "VALUES (#{id}, #{projectId}, #{uploadedBy}, #{fileName}, #{originalFileName}, #{fileType}, #{fileSize}, #{filePath}, #{fileUrl}, #{uploadedAt}, #{isDeleted})")
    void insert(SharedFile file);

    @Select("SELECT sf.*, u.name as uploader_name " +
            "FROM shared_files sf " +
            "JOIN users u ON sf.uploaded_by = u.id " +
            "WHERE sf.project_id = #{projectId} AND sf.is_deleted = false " +
            "ORDER BY sf.uploaded_at DESC " +
            "LIMIT #{limit} OFFSET #{offset}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "uploadedBy", column = "uploaded_by"),
        @Result(property = "uploaderName", column = "uploader_name"),
        @Result(property = "fileName", column = "file_name"),
        @Result(property = "originalFileName", column = "original_file_name"),
        @Result(property = "fileType", column = "file_type"),
        @Result(property = "fileSize", column = "file_size"),
        @Result(property = "fileUrl", column = "file_url"),
        @Result(property = "uploadedAt", column = "uploaded_at")
    })
    List<SharedFileResponse> findByProjectId(@Param("projectId") UUID projectId, 
                                           @Param("limit") int limit, 
                                           @Param("offset") int offset);

    @Select("SELECT sf.*, u.name as uploader_name " +
            "FROM shared_files sf " +
            "JOIN users u ON sf.uploaded_by = u.id " +
            "WHERE sf.id = #{id} AND sf.is_deleted = false")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "uploadedBy", column = "uploaded_by"),
        @Result(property = "uploaderName", column = "uploader_name"),
        @Result(property = "fileName", column = "file_name"),
        @Result(property = "originalFileName", column = "original_file_name"),
        @Result(property = "fileType", column = "file_type"),
        @Result(property = "fileSize", column = "file_size"),
        @Result(property = "fileUrl", column = "file_url"),
        @Result(property = "uploadedAt", column = "uploaded_at")
    })
    SharedFileResponse findById(@Param("id") UUID id);

    @Select("SELECT sf.*, u.name as uploader_name " +
            "FROM shared_files sf " +
            "JOIN users u ON sf.uploaded_by = u.id " +
            "WHERE sf.id = ANY(#{ids}) AND sf.is_deleted = false")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "projectId", column = "project_id"),
        @Result(property = "uploadedBy", column = "uploaded_by"),
        @Result(property = "uploaderName", column = "uploader_name"),
        @Result(property = "fileName", column = "file_name"),
        @Result(property = "originalFileName", column = "original_file_name"),
        @Result(property = "fileType", column = "file_type"),
        @Result(property = "fileSize", column = "file_size"),
        @Result(property = "fileUrl", column = "file_url"),
        @Result(property = "uploadedAt", column = "uploaded_at")
    })
    List<SharedFileResponse> findByIds(@Param("ids") UUID[] ids);

    @Update("UPDATE shared_files SET is_deleted = true WHERE id = #{id}")
    void softDelete(@Param("id") UUID id);

    @Select("SELECT COUNT(*) FROM shared_files WHERE project_id = #{projectId} AND is_deleted = false")
    long countByProjectId(@Param("projectId") UUID projectId);
}