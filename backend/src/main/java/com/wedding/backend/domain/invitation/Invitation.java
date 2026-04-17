package com.wedding.backend.domain.invitation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "groom_name", nullable = false, length = 50)
    private String groomName;

    @Column(name = "bride_name", nullable = false, length = 50)
    private String brideName;

    @Column(name = "wedding_date", nullable = false)
    private LocalDate weddingDate;

    @Column(nullable = false, length = 120)
    private String venue;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Invitation() {
    }

    public Invitation(String title, String groomName, String brideName, LocalDate weddingDate, String venue) {
        this.title = title;
        this.groomName = groomName;
        this.brideName = brideName;
        this.weddingDate = weddingDate;
        this.venue = venue;
    }

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getGroomName() {
        return groomName;
    }

    public String getBrideName() {
        return brideName;
    }

    public LocalDate getWeddingDate() {
        return weddingDate;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
