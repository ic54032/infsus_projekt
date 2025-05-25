package org.example.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ClanDTO;
import org.example.backend.dto.StatistikaDTO;
import org.example.backend.model.*;
import org.example.backend.service.ClanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/clan")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ClanController {
    private final ClanService clanService;

    @GetMapping("/all")
    public ResponseEntity<List<ClanDTO>> dohvatiSveClanove() {
        List<ClanDTO> clanovi = clanService.dohvatiSveClanove().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clanovi);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClanDTO> dohvatiClanaPremId(@PathVariable Long id) {
        Clan clan = clanService.dohvatiClanaPremId(id);
        if (clan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(clan));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ClanDTO> dohvatiClanaPremEmail(@PathVariable String email) {
        Clan clan = clanService.dohvatiClanaPremEmail(email);
        return ResponseEntity.ok(convertToDto(clan));
    }

    @PostMapping("/create")
    public ResponseEntity<ClanDTO> kreirajClana(@RequestBody ClanDTO clanDTO) {
        Clan noviClan = clanService.kreirajClana(clanDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(noviClan));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<ClanDTO> azurirajClana(@PathVariable Long id, @RequestBody ClanDTO clanDetalji) {
        Clan azuriraniClan = clanService.azurirajClana(id, clanDetalji);
        if (azuriraniClan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(azuriraniClan));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> obrisiClana(@PathVariable Long id) {
        clanService.obrisiClana(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistika/{id}")
    public ResponseEntity<StatistikaDTO> dohvatiStatistikuClana(@PathVariable Long id) {
        StatistikaDTO statistika = clanService.dohvatiStatistikuIgraca(id);
        return ResponseEntity.ok(statistika);
    }


    private ClanDTO convertToDto(Clan clan) {
        ClanDTO dto = new ClanDTO();
        dto.setId(clan.getId());
        dto.setIme(clan.getIme());
        dto.setPrezime(clan.getPrezime());
        dto.setEmail(clan.getEmail());
        dto.setNadimak(clan.getNadimak());
        return dto;
    }

    private Clan convertToEntity(ClanDTO dto) {
        Clan clan = new Clan();
        clan.setId(dto.getId());
        clan.setIme(dto.getIme());
        clan.setPrezime(dto.getPrezime());
        clan.setEmail(dto.getEmail());
        clan.setNadimak(dto.getNadimak());
        return clan;
    }
}




