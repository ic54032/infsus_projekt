package org.example.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.LigaDTO;
import org.example.backend.dto.MecResponseDTO;
import org.example.backend.model.Liga;
import org.example.backend.model.Mec;
import org.example.backend.service.LigaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/liga")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LigaController {

    private final LigaService ligaService;

    @GetMapping("/all")
    public ResponseEntity<List<LigaDTO>> dohvatiSveLige() {
        List<Liga> lige = ligaService.dohvatiSveLige();
        List<LigaDTO> ligaDTOs = lige.stream()
                .map(LigaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ligaDTOs);
    }

    @GetMapping("/{naziv}")
    public ResponseEntity<LigaDTO> dohvatiLiguPoNazivu(@PathVariable String naziv) {
        Liga liga = ligaService.dohvatiLiguPremIme(naziv);
        if (liga == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new LigaDTO(liga));
    }

    @PostMapping("/create")
    public ResponseEntity<LigaDTO> kreirajLigu(@RequestBody LigaDTO ligaDTO) {
        Liga novaLiga = ligaService.kreirajLigu(ligaDTO);
        return ResponseEntity.ok(new LigaDTO(novaLiga));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<LigaDTO> azurirajLigu(@PathVariable("id") Long ligaId, @RequestBody LigaDTO ligaDTO) {
        Liga azuriranaLiga = ligaService.azurirajLigu(ligaId, ligaDTO);
        return ResponseEntity.ok(new LigaDTO(azuriranaLiga));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> obrisiLigu(@PathVariable Long id) {
        ligaService.obrisiLigu(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{nazivLige}/mecevi")
    public ResponseEntity<List<MecResponseDTO>> dohvatiMeceveLige(@PathVariable String nazivLige) {
        List<Mec> mecevi = ligaService.dohvatiSveMecevePremLiga(nazivLige);
        List<MecResponseDTO> mecDTOs = mecevi.stream()
                .map(MecResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mecDTOs);
    }
}
