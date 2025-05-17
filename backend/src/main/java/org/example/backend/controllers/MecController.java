package org.example.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MecDTO;
import org.example.backend.dto.MecResponseDTO;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusMeca;
import org.example.backend.service.MecService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mec")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MecController {

    private final MecService mecService;

    @GetMapping("/all")
    public ResponseEntity<List<MecResponseDTO>> dohvatiSveMeceve() {
        List<Mec> mecevi = mecService.dohvatiSveMeceve();
        List<MecResponseDTO> meceviResponse = mecevi.stream()
                .map(MecResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(meceviResponse);
    }

    @GetMapping("/liga/{naziv}")
    public ResponseEntity<List<MecResponseDTO>> dohvatiMecevePremaNazivuLige(@PathVariable String naziv) {
        List<Mec> mecevi = mecService.dohvatiMecPremLiga(naziv);
        List<MecResponseDTO> meceviDTO = mecevi.stream()
                .map(MecResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(meceviDTO);
    }

    @PostMapping("/create")
    public ResponseEntity<MecResponseDTO> kreirajMec(@RequestBody MecDTO mecDTO) {
        Mec noviMec = mecService.kreirajMec(mecDTO);
        return ResponseEntity.ok(new MecResponseDTO(noviMec));
    }

    @PostMapping("update/{id}")
    public ResponseEntity<MecResponseDTO> azurirajMec(@PathVariable Long id, @RequestBody MecDTO mecDTO) {
        Mec azuriraniMec = mecService.azurirajMec(id, mecDTO);
        return ResponseEntity.ok(new MecResponseDTO(azuriraniMec));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> obrisiMec(@PathVariable Long id) {
        mecService.obrisiMec(id);
        return ResponseEntity.noContent().build();
    }
}