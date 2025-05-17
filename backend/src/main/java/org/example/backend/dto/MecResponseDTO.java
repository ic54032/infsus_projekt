package org.example.backend.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusMeca;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MecResponseDTO {
    private Long id;
    private Long ligaId;
    private String ligaNaziv;
    private Long igrac1Id;
    private String igrac1Ime;
    private Long igrac2Id;
    private String igrac2Ime;
    private LocalDate datum;
    private LocalTime vrijeme;
    private String rezultat;
    private StatusMeca status;

    public MecResponseDTO(Mec mec) {
        this.id = mec.getId();
        this.ligaId = mec.getLiga().getId();
        this.ligaNaziv = mec.getLiga() != null ? mec.getLiga().getNaziv() : null;

        if (mec.getIgrac1() != null) {
            this.igrac1Id = mec.getIgrac1().getId();
            this.igrac1Ime = mec.getIgrac1().getIme() + " " + mec.getIgrac1().getPrezime();
        }

        if (mec.getIgrac2() != null) {
            this.igrac2Id = mec.getIgrac2().getId();
            this.igrac2Ime = mec.getIgrac2().getIme() + " " + mec.getIgrac2().getPrezime();
        }

        this.datum = mec.getDatum();
        this.vrijeme = mec.getVrijeme();
        this.rezultat = mec.getRezultat();
        this.status = mec.getStatus();
    }
}
