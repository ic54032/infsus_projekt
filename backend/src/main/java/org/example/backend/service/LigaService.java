package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.LigaDTO;
import org.example.backend.model.*;
import org.example.backend.repository.*;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LigaService {

     private final LigaRepository ligaRepository;
     private final MecRepository mecRepository;


     public Liga dohvatiLiguPremIme(String naziv) {
         return ligaRepository.findByNaziv(naziv);
     }

     public List<Liga> dohvatiSveLige() {
         return ligaRepository.findAll();
     }

    public List<Mec> dohvatiSveMecevePremLiga(String nazivLiga) {
        // First find the liga by name
        Liga liga = ligaRepository.findByNaziv(nazivLiga);
        if (liga == null) {
            throw new EntityNotFoundException("Liga s nazivom " + nazivLiga + " nije pronađena");
        }
        // Then find mecevi by liga naziv
        return mecRepository.findByLigaNaziv(liga.getNaziv());
    }

     public Liga kreirajLigu(LigaDTO ligaDTO) {
         if (ligaRepository.existsByNaziv(ligaDTO.getNaziv())) {
             throw new RuntimeException("Naziv " + ligaDTO.getNaziv() + " već postoji");
         }
            Liga liga = new Liga();
            liga.setNaziv(ligaDTO.getNaziv());
            liga.setDatumPocetka(ligaDTO.getDatumPocetka());
            liga.setDatumZavrsetka(ligaDTO.getDatumZavrsetka());
            liga.setFormat(ligaDTO.getFormat());
            liga.setMax_igraca(ligaDTO.getMax_igraca());
            liga.setStatus(ligaDTO.getStatus());

         return ligaRepository.save(liga);
     }
        public Liga azurirajLigu(Long ligaId, LigaDTO ligaDetalji) {
            Liga liga = ligaRepository.findById(ligaId)
                    .orElseThrow(() -> new RuntimeException("Liga s ID-om " + ligaId + " nije pronađena"));

            liga.setNaziv(ligaDetalji.getNaziv());
            liga.setDatumPocetka(ligaDetalji.getDatumPocetka());
            liga.setDatumZavrsetka(ligaDetalji.getDatumZavrsetka());
            liga.setFormat(ligaDetalji.getFormat());
            liga.setMax_igraca(ligaDetalji.getMax_igraca());
            liga.setStatus(ligaDetalji.getStatus());

            return ligaRepository.save(liga);
        }

        public void obrisiLigu(Long id) {
            Liga liga = ligaRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Liga s ID-om " + id + " nije pronađena"));

            ligaRepository.delete(liga);
        }



}
