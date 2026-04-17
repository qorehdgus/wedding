package com.wedding.backend.domain.invitation;

import java.time.LocalDate;

public record InvitationCreateRequest(
        String title,
        String groomName,
        String brideName,
        LocalDate weddingDate,
        String venue
) {
}
