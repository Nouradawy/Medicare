package com.Medicare.controller;

import com.Medicare.model.User;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class NotificationController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody String subscription) {
        Integer userId = JwtUtils.getLoggedInUserId();
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setPushSubscription(subscription);
            userRepository.save(user);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/push")
    public void sendPush(@RequestBody Map<String, String> payload) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String message = payload.getOrDefault("message", "Push Body");

        for (User user : userRepository.findAll()) {
            String subJson = user.getPushSubscription();
            if (subJson == null) continue;

            // Parse subscription JSON
            Map<String, Object> sub = mapper.readValue(subJson, Map.class);
            String endpoint = (String) sub.get("endpoint");
            Map<String, String> keys = (Map<String, String>) sub.get("keys");
            String p256dh = keys.get("p256dh");
            String auth = keys.get("auth");

            // Build and send notification
            JSONObject NotificationPayload = new JSONObject();
            NotificationPayload.put("title", "Reservation Inquiry");
            NotificationPayload.put("body", message);
            NotificationPayload.put("url", "https://medicare.work.gd/");

            Notification notification = new Notification(
                    endpoint, p256dh, auth,
                    NotificationPayload.toString().getBytes()
            );

            PushService pushService = new PushService()
                    .setPublicKey("BG4RexXOjw1VP-aLtSrCVCva4p5rk9crSInF8848SvWXGESDpZRqBb3YNNEtmRGI0VANCYft2DojG8QhHIhCPnU")
                    .setPrivateKey("_xqlMZjKw2GdCXKIKCh4CYz7itOnIjJMku7vjhVR9Qo")
                    .setSubject("mailto:you@example.com");

            pushService.send(notification);
        }

    }

    @GetMapping("/push")
    public String pushPage() {
        return "api/push";
    }
}
