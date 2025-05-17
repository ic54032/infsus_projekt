package org.example.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.example.backend.model.enums.StatusLige;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lige")
@Data
public class Liga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naziv;

    @Column(name = "datum_pocetka")
    private LocalDate datumPocetka;

    @Column(name = "datum_zavrsetka")
    private LocalDate datumZavrsetka;

    @Column(name = "format")
    private String format;

    @Column(name = "max_igraca")
    private Integer max_igraca;

    @Enumerated(EnumType.STRING)
    private StatusLige status;

    @ManyToOne
    @JoinColumn(name = "voditelj_id")
    private Voditelj voditelj;

    @OneToMany(mappedBy = "liga")
    private List<Mec> mecevi = new ArrayList<>();

}

