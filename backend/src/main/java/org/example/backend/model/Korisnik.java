package org.example.backend.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "korisnici")
@Data
public abstract class Korisnik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ime;

    @Column(nullable = false)
    private String prezime;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String lozinka;

}
