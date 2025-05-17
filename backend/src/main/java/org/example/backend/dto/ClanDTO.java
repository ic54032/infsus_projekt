package org.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClanDTO {
    private Long id;
    private String ime;
    private String prezime;
    private String email;
    private String nadimak;
}
