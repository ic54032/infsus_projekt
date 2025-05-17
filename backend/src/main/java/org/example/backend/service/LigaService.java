package org.example.backend.service;

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
         return mecRepository.findByLigaNaziv(nazivLiga);
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
            if (!ligaRepository.existsById(id)) {
                throw new DuplicateKeyException("Liga s ID-om " + id + " nije pronađena");
            }
            ligaRepository.deleteById(id);
        }



}
