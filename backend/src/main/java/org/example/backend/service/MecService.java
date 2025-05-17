package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MecDTO;
import org.example.backend.model.*;
import org.example.backend.model.enums.StatusMeca;
import org.example.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MecService {

     private final MecRepository mecRepository;
     private final LigaRepository ligaRepository;
     private final ClanRepository clanRepository;

     public List<Mec> dohvatiSveMeceve() {
         return mecRepository.findAll();
     }

     public List<Mec> dohvatiMecPremLiga(String naziv) {

         return mecRepository.findByLigaNaziv(naziv);
     }

     public List<Mec> dohvatiMecPremIgrac(Clan igrac) {
         return mecRepository.findByIgrac1OrIgrac2(igrac, igrac);
     }

     public List<Mec> dohvatiMecPremStatus(StatusMeca status) {
         return mecRepository.findByStatus(status);
     }

     public List<Mec> dohvatiMecPremDatum(LocalDate pocetak, LocalDate kraj) {
         return mecRepository.findByDatumBetween(pocetak, kraj);
     }

    public Mec kreirajMec(MecDTO mecDTO) {
        Liga liga = ligaRepository.findById(mecDTO.getLigaId())
                .orElseThrow(() -> new RuntimeException("Liga s ID-om " + mecDTO.getLigaId() + " nije pronađena"));
        Mec mec = new Mec();
        mec.setLiga(liga);
        Clan igrac1 = clanRepository.findById(mecDTO.getIgrac1Id())
                .orElseThrow(() -> new RuntimeException("Igrac1 s ID-om " + mecDTO.getIgrac1Id() + " nije pronađen"));
        Clan igrac2 = clanRepository.findById(mecDTO.getIgrac2Id())
                .orElseThrow(() -> new RuntimeException("Igrac2 s ID-om " + mecDTO.getIgrac2Id() + " nije pronađen"));

        mec.setIgrac1(igrac1);
        mec.setIgrac2(igrac2);
        mec.setDatum(mecDTO.getDatum());
        mec.setVrijeme(mecDTO.getVrijeme());
        mec.setRezultat(mecDTO.getRezultat());
        mec.setStatus(mecDTO.getStatus());

        return mecRepository.save(mec);
    }

    public Mec azurirajMec(Long Id,MecDTO mecDTO) {
        Mec mec = mecRepository.findById(Id).orElseThrow(() -> new RuntimeException("Mec ne postoji"));

        Clan igrac1 = clanRepository.findById(mecDTO.getIgrac1Id())
                .orElseThrow(() -> new RuntimeException("Igrac1 s ID-om " + mecDTO.getIgrac1Id() + " nije pronađen"));
        Clan igrac2 = clanRepository.findById(mecDTO.getIgrac2Id())
                .orElseThrow(() -> new RuntimeException("Igrac2 s ID-om " + mecDTO.getIgrac2Id() + " nije pronađen"));
        mec.setIgrac1(igrac1);
        mec.setIgrac2(igrac2);
        mec.setDatum(mecDTO.getDatum());
        mec.setVrijeme(mecDTO.getVrijeme());
        mec.setRezultat(mecDTO.getRezultat());
        mec.setStatus(mecDTO.getStatus());

        return mecRepository.save(mec);
    }

    public void obrisiMec(Long id) {
        if (!mecRepository.existsById(id)) {
            throw new RuntimeException("Mec s ID-om " + id + " nije pronađen");
        }
        mecRepository.deleteById(id);
    }
}
