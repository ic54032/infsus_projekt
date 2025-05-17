package org.example.backend.dto;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.model.Clan;
import org.example.backend.model.Liga;
import org.example.backend.model.enums.StatusMeca;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class MecDTO {
    private Long ligaId;
    private Long igrac1Id;
    private Long igrac2Id;
    private LocalDate datum;
    private LocalTime vrijeme;
    private String rezultat;
    private StatusMeca status;
}
