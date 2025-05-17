package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.example.backend.model.Clan;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusMeca;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistikaDTO {
    private Long igracId;
    private int brojPobjeda;
    private int brojPoraza;

    public StatistikaDTO(Long igracId, List<MecDTO> mecevi) {
        int pobjede = 0;
        int ukMeceva = 0;

        for (MecDTO mec : mecevi) {
            if (mec.getStatus() == StatusMeca.ZAVRSEN) {
                    ukMeceva++;

                    String[] rezultat = mec.getRezultat().split(":");
                    int score1 = Integer.parseInt(rezultat[0].trim());
                    int score2 = Integer.parseInt(rezultat[1].trim());

                    boolean isWinner = false;
                    if (igracId.equals(mec.getIgrac1Id()) && score1 > score2) {
                        isWinner = true;
                    } else if (igracId.equals(mec.getIgrac2Id()) && score2 > score1) {
                        isWinner = true;
                    }

                    if (isWinner) {
                        pobjede++;
                    }
            }
        }

        this.igracId= igracId;
        this.brojPobjeda = pobjede;
        this.brojPoraza = ukMeceva - pobjede;
    }
}
