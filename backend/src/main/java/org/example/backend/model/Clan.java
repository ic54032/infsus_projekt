package org.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clanovi")
@Data
@EqualsAndHashCode(callSuper = true)
public class Clan extends Korisnik {

    @Column(name = "nadimak")
    private String nadimak;

    @OneToMany(mappedBy = "igrac1")
    private List<Mec> meceviKaoIgrac1 = new ArrayList<>();

    @OneToMany(mappedBy = "igrac2")
    private List<Mec> meceviKaoIgrac2 = new ArrayList<>();

}
