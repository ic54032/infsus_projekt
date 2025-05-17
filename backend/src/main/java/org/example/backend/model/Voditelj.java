package org.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "voditelji")
@Data
@EqualsAndHashCode(callSuper = true)
public class Voditelj extends Korisnik {
    @Column(name= "opis_zaduzenja")
    private String opisZaduzenja;

    @Column(name = "telefon")
    private String telefon;

    @OneToMany(mappedBy = "voditelj")
    private List<Liga> lige = new ArrayList<>();

}
