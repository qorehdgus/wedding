package com.wedding.backend.query.invitation;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/query/invitations")
public class InvitationQueryController {

    private final InvitationQueryService invitationQueryService;

    public InvitationQueryController(InvitationQueryService invitationQueryService) {
        this.invitationQueryService = invitationQueryService;
    }

    @GetMapping
    public List<InvitationSummaryDto> findAll(@RequestParam(required = false) String venue) {
        return invitationQueryService.findAll(venue);
    }
}
