package com.wedding.backend.domain.invitation;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;

    public InvitationService(InvitationRepository invitationRepository) {
        this.invitationRepository = invitationRepository;
    }

    @Transactional
    public InvitationResponse create(InvitationCreateRequest request) {
        Invitation invitation = new Invitation(
                request.title(),
                request.groomName(),
                request.brideName(),
                request.weddingDate(),
                request.venue()
        );

        return InvitationResponse.from(invitationRepository.save(invitation));
    }

    @Transactional(readOnly = true)
    public InvitationResponse get(Long id) {
        Invitation invitation = invitationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invitation not found. id=" + id));
        return InvitationResponse.from(invitation);
    }
}
