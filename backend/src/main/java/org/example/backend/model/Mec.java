package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.example.backend.model.enums.StatusMeca;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "mecevi")
@Data
public class Mec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;

    @ManyToOne
    @JoinColumn(name = "igrac1", nullable = false)
    private Clan igrac1;

    @ManyToOne
    @JoinColumn(name = "igrac2", nullable = false)
    private Clan igrac2;

    @Column(name = "datum")
    private LocalDate datum;

    @Column(name = "vrijeme")
    private LocalTime vrijeme;

    @Column(name = "rezultat")
    private String rezultat;

    @Enumerated(EnumType.STRING)
    private StatusMeca status;
}
