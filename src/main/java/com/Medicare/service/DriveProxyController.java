package com.Medicare.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.InputStream;
import java.io.OutputStream;

@RestController
@RequestMapping("/proxy")
public class DriveProxyController {

    @GetMapping("/{fileId}")
    public void proxyFile(@PathVariable String fileId, HttpServletResponse response) {
        String url = "https://drive.google.com/uc?export=download&id=" + fileId;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<byte[]> resp = restTemplate.getForEntity(url, byte[].class);

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/pdf");
        try {
            OutputStream os = response.getOutputStream();
            os.write(resp.getBody());
            os.flush();
        } catch (Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}