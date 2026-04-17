package com.wedding.backend.domain.invitation;

import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InvitationSeedConfig {

    @Bean
    CommandLineRunner invitationSeeder(InvitationRepository invitationRepository) {
        return args -> {
            if (invitationRepository.count() > 0) {
                return;
            }

            invitationRepository.save(new Invitation(
                    "Spring Wedding Invitation",
                    "Minjun",
                    "Seohee",
                    LocalDate.of(2026, 10, 24),
                    "Seoul Garden Hall"
            ));

            invitationRepository.save(new Invitation(
                    "Family Ceremony",
                    "Jiho",
                    "Yuna",
                    LocalDate.of(2026, 11, 7),
                    "Han River Convention"
            ));
        };
    }
}
