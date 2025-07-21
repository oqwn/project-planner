package com.example.projectplanner.service;

import com.example.projectplanner.dto.SharedFileResponse;
import com.example.projectplanner.entity.SharedFile;
import com.example.projectplanner.entity.User;
import com.example.projectplanner.mapper.SharedFileMapper;
import com.example.projectplanner.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class SharedFileService {

    @Autowired
    private SharedFileMapper sharedFileMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private FileIconService fileIconService;

    private final String uploadDir = "uploads/"; // Configure this path as needed

    public List<SharedFileResponse> getProjectFiles(UUID projectId, int page, int size) {
        int offset = page * size;
        List<SharedFileResponse> files = sharedFileMapper.findByProjectId(projectId, size, offset);
        
        // Set file icons
        files.forEach(file -> 
            file.setFileIcon(fileIconService.getIconForFileType(file.getFileType()))
        );
        
        return files;
    }

    public SharedFileResponse uploadFile(UUID projectId, MultipartFile file, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + userEmail);
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFileName = file.getOriginalFilename();
            String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = uploadPath.resolve(fileName);

            // For demo purposes, we'll simulate file upload without actually saving
            // In production, you would save the file: Files.copy(file.getInputStream(), filePath);
            
            // Create shared file entity
            SharedFile sharedFile = new SharedFile(
                projectId,
                currentUser.getId(),
                fileName,
                originalFileName,
                file.getContentType(),
                file.getSize(),
                filePath.toString()
            );

            // Set mock file URL for demo
            sharedFile.setFileUrl("/api/files/" + sharedFile.getId() + "/download");

            // Save to database
            sharedFileMapper.insert(sharedFile);

            // Return response
            SharedFileResponse response = sharedFileMapper.findById(sharedFile.getId());
            response.setFileIcon(fileIconService.getIconForFileType(response.getFileType()));
            
            return response;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public SharedFileResponse getFile(UUID fileId) {
        SharedFileResponse file = sharedFileMapper.findById(fileId);
        if (file != null) {
            file.setFileIcon(fileIconService.getIconForFileType(file.getFileType()));
        }
        return file;
    }

    public void deleteFile(UUID fileId, String userEmail) {
        User currentUser = userMapper.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found: " + userEmail);
        }

        SharedFileResponse file = sharedFileMapper.findById(fileId);
        if (file == null) {
            throw new RuntimeException("File not found");
        }

        // Only allow deletion by uploader or admin
        if (!currentUser.getId().equals(file.getUploadedBy()) && !"ADMIN".equals(currentUser.getRole())) {
            throw new RuntimeException("Not authorized to delete this file");
        }

        sharedFileMapper.softDelete(fileId);
    }

    public long getFileCount(UUID projectId) {
        return sharedFileMapper.countByProjectId(projectId);
    }
}