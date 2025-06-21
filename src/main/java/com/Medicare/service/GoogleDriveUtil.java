package com.Medicare.service;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.model.Permission;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleDriveUtil {
    private final Drive driveService;

    public GoogleDriveUtil(Drive driveService) {
        this.driveService = driveService;
    }

    public String uploadFile(MultipartFile multipartFile, String folderId) throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(multipartFile.getOriginalFilename());
        if (folderId != null) {
            fileMetadata.setParents(Collections.singletonList(folderId));
        }
        InputStreamContent mediaContent = new InputStreamContent(
                multipartFile.getContentType(),
                multipartFile.getInputStream()
        );
        File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        Permission permission = new Permission()
                .setType("anyone")
                .setRole("reader");

        driveService.permissions()
                .create(uploadedFile.getId(), permission)
                .setFields("id")
                .execute();        return uploadedFile.getId();

    }

    public File getFileMetadata(String fileId) throws IOException {
        return driveService.files().get(fileId).setFields("webViewLink").execute();
    }

    public String createFolder(String folderName, String parentFolderId) throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(folderName);
        fileMetadata.setMimeType("application/vnd.google-apps.folder");
        if (parentFolderId != null) {
            fileMetadata.setParents(Collections.singletonList(parentFolderId));
        }
        File folder = driveService.files().create(fileMetadata)
                .setFields("id")
                .execute();
        return folder.getId();
    }

    public String getOrCreateFolder(String folderName, String parentFolderId) throws IOException {
        String query = "mimeType='application/vnd.google-apps.folder' and name='" + folderName + "' and trashed=false";
        if (parentFolderId != null) {
            query += " and '" + parentFolderId + "' in parents";
        }
        List<File> files = driveService.files().list()
                .setQ(query)
                .setFields("files(id, name)")
                .execute()
                .getFiles();

        if (files != null && !files.isEmpty()) {
            return files.get(0).getId(); // Folder exists
        } else {
            // Folder does not exist, create it
            createFolder(folderName, parentFolderId);
            return files.get(0).getId();
        }
    }
}