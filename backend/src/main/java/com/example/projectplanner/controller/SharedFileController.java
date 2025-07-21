package com.example.projectplanner.controller;

import com.example.projectplanner.dto.SharedFileResponse;
import com.example.projectplanner.service.SharedFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class SharedFileController {

    @Autowired
    private SharedFileService sharedFileService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SharedFileResponse>> getProjectFiles(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<SharedFileResponse> files = sharedFileService.getProjectFiles(projectId, page, size);
        return ResponseEntity.ok(files);
    }

    @PostMapping("/project/{projectId}/upload")
    public ResponseEntity<SharedFileResponse> uploadFile(
            @PathVariable UUID projectId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String userEmail) {
        
        SharedFileResponse response = sharedFileService.uploadFile(projectId, file, userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<SharedFileResponse> getFile(@PathVariable UUID fileId) {
        SharedFileResponse file = sharedFileService.getFile(fileId);
        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(file);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable UUID fileId,
            @AuthenticationPrincipal String userEmail) {
        
        sharedFileService.deleteFile(fileId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}/count")
    public ResponseEntity<Long> getFileCount(@PathVariable UUID projectId) {
        long count = sharedFileService.getFileCount(projectId);
        return ResponseEntity.ok(count);
    }
}