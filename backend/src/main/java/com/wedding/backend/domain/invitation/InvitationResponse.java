package com.wedding.backend.domain.invitation;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvitationResponse(
        Long id,
        String title,
        String groomName,
        String brideName,
        LocalDate weddingDate,
        String venue,
        LocalDateTime createdAt
) {
    public static InvitationResponse from(Invitation invitation) {
        return new InvitationResponse(
                invitation.getId(),
                invitation.getTitle(),
                invitation.getGroomName(),
                invitation.getBrideName(),
                invitation.getWeddingDate(),
                invitation.getVenue(),
                invitation.getCreatedAt()
        );
    }
}
