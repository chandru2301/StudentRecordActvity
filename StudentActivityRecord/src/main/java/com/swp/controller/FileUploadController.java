package com.swp.controller;

import com.swp.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${cors.allowed-origins}")
public class FileUploadController {
    
    private final FileUploadService fileUploadService;
    
    /**
     * Upload a certificate file
     * @param file the file to upload
     * @return the file URL
     */
    @PostMapping("/certificate")
    public ResponseEntity<Map<String, String>> uploadCertificate(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Uploading certificate file: {}", file.getOriginalFilename());
            
            String fileUrl = fileUploadService.uploadFile(file, "certificates");
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("message", "File uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid file upload: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("Error uploading file", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Delete a file
     * @param fileUrl the file URL to delete
     * @return success message
     */
    @DeleteMapping("/file")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        try {
            log.info("Deleting file: {}", fileUrl);
            
            boolean deleted = fileUploadService.deleteFile(fileUrl);
            
            Map<String, String> response = new HashMap<>();
            if (deleted) {
                response.put("message", "File deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "File not found or could not be deleted");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error deleting file", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Check if file exists
     * @param fileUrl the file URL to check
     * @return file existence status
     */
    @GetMapping("/file/exists")
    public ResponseEntity<Map<String, Object>> checkFileExists(@RequestParam("fileUrl") String fileUrl) {
        try {
            boolean exists = fileUploadService.fileExists(fileUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            response.put("fileUrl", fileUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking file existence", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to check file existence");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
