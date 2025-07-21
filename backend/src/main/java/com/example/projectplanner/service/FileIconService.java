package com.example.projectplanner.service;

import org.springframework.stereotype.Service;

@Service
public class FileIconService {

    public String getIconForFileType(String fileType) {
        if (fileType == null) {
            return "📄"; // Default file icon
        }

        String lowerType = fileType.toLowerCase();
        
        // Document types
        if (lowerType.contains("pdf")) return "📄";
        if (lowerType.contains("doc") || lowerType.contains("docx")) return "📝";
        if (lowerType.contains("txt")) return "📃";
        if (lowerType.contains("rtf")) return "📄";
        
        // Spreadsheet types
        if (lowerType.contains("xls") || lowerType.contains("xlsx") || lowerType.contains("csv")) return "📊";
        
        // Presentation types
        if (lowerType.contains("ppt") || lowerType.contains("pptx")) return "📊";
        
        // Image types
        if (lowerType.contains("jpg") || lowerType.contains("jpeg") || 
            lowerType.contains("png") || lowerType.contains("gif") || 
            lowerType.contains("svg") || lowerType.contains("bmp")) return "🖼️";
        
        // Video types
        if (lowerType.contains("mp4") || lowerType.contains("avi") || 
            lowerType.contains("mov") || lowerType.contains("wmv") || 
            lowerType.contains("mkv")) return "🎥";
        
        // Audio types
        if (lowerType.contains("mp3") || lowerType.contains("wav") || 
            lowerType.contains("flac") || lowerType.contains("aac")) return "🎵";
        
        // Archive types
        if (lowerType.contains("zip") || lowerType.contains("rar") || 
            lowerType.contains("7z") || lowerType.contains("tar")) return "🗜️";
        
        // Code types
        if (lowerType.contains("java") || lowerType.contains("js") || 
            lowerType.contains("ts") || lowerType.contains("py") || 
            lowerType.contains("css") || lowerType.contains("html") || 
            lowerType.contains("json") || lowerType.contains("xml")) return "💻";
        
        return "📄"; // Default
    }
}