package com.wedding.backend;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public Map<String, Object> hello() {
        return Map.of(
                "message", "Spring Boot backend is running",
                "service", "wedding-backend",
                "writeApi", "JPA -> /api/invitations",
                "queryApi", "MyBatis -> /api/query/invitations"
        );
    }
}
