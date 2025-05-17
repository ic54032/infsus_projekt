package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.model.Liga;
import org.example.backend.model.enums.StatusLige;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class LigaDTO {
    private Long id;
    private String naziv;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private String format;
    private Integer max_igraca;
    private StatusLige status;

    public LigaDTO(Liga liga) {
        this.id = liga.getId();
        this.naziv = liga.getNaziv();
        this.datumPocetka = liga.getDatumPocetka();
        this.datumZavrsetka = liga.getDatumZavrsetka();
        this.format = liga.getFormat();
        this.max_igraca = liga.getMax_igraca();
        this.status = liga.getStatus();
    }
}
