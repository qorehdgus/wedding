package com.wedding.backend.query.invitation;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InvitationQueryService {

    private final InvitationQueryMapper invitationQueryMapper;

    public InvitationQueryService(InvitationQueryMapper invitationQueryMapper) {
        this.invitationQueryMapper = invitationQueryMapper;
    }

    @Transactional(readOnly = true)
    public List<InvitationSummaryDto> findAll(String venue) {
        return invitationQueryMapper.findAll(venue);
    }
}
