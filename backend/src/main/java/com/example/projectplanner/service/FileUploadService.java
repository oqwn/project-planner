package com.example.projectplanner.service;

import com.example.projectplanner.dto.SharedFileResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class FileUploadService {
    
    public SharedFileResponse uploadFile(MultipartFile file, UUID conversationId, UUID userId) {
        // TODO: Implement actual file upload logic
        SharedFileResponse response = new SharedFileResponse();
        response.setId(UUID.randomUUID());
        response.setFileName(file.getOriginalFilename());
        response.setFileUrl("/files/" + UUID.randomUUID());
        response.setFileType(file.getContentType());
        response.setFileSize(file.getSize());
        response.setUploadedBy(userId);
        response.setUploadedAt(java.time.OffsetDateTime.now());
        
        return response;
    }
}