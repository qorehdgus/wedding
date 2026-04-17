package com.wedding.backend.query.invitation;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvitationSummaryDto(
        Long id,
        String title,
        String groomName,
        String brideName,
        LocalDate weddingDate,
        String venue,
        LocalDateTime createdAt
) {
}
