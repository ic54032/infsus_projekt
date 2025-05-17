package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ClanDTO;
import org.example.backend.dto.MecDTO;
import org.example.backend.dto.StatistikaDTO;
import org.example.backend.model.Clan;
import org.example.backend.model.Mec;
import org.example.backend.repository.ClanRepository;
import org.example.backend.repository.MecRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClanService {
    private final ClanRepository clanRepository;
    private final MecRepository mecRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Clan> dohvatiSveClanove() {
        return clanRepository.findAll();
    }

    public Clan dohvatiClanaPremId(Long id) {
        return clanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Član s ID-om " + id + " nije pronađen"));
    }

    public Clan dohvatiClanaPremEmail(String email) {
        return clanRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Član s email-om " + email + " nije pronađen"));
    }

    public Clan kreirajClana(ClanDTO clanDTO) {
        if (clanRepository.existsByEmail(clanDTO.getEmail())) {
            throw new DuplicateKeyException("Email " + clanDTO.getEmail() + " već postoji");
        }
        Clan clan = new Clan();
        clan.setIme(clanDTO.getIme());
        clan.setPrezime(clanDTO.getPrezime());
        clan.setEmail(clanDTO.getEmail());
        clan.setNadimak(clanDTO.getNadimak());
        clan.setLozinka(passwordEncoder.encode(clanDTO.getEmail())); //generiraj pocetnu lozinku i posalji na mail clana

        return clanRepository.save(clan);
    }

    public Clan azurirajClana(Long id, ClanDTO clanDetalji) {
        Clan clan = dohvatiClanaPremId(id);

        clan.setIme(clanDetalji.getIme());
        clan.setPrezime(clanDetalji.getPrezime());
        clan.setNadimak(clanDetalji.getNadimak());

        // Email promjena zahtijeva dodatnu validaciju
        if (!clan.getEmail().equals(clanDetalji.getEmail())) {
            if (clanRepository.existsByEmail(clanDetalji.getEmail())) {
                throw new DuplicateKeyException("Email " + clanDetalji.getEmail() + " već postoji");
            }
            clan.setEmail(clanDetalji.getEmail());
        }
        clan.setMeceviKaoIgrac1(clan.getMeceviKaoIgrac1());
        clan.setMeceviKaoIgrac2(clan.getMeceviKaoIgrac2());

        return clanRepository.save(clan);
    }

    public void obrisiClana(Long id) {
        if (!clanRepository.existsById(id)) {
            throw new EntityNotFoundException("Član s ID-om " + id + " nije pronađen");
        }
        clanRepository.deleteById(id);
    }

    public StatistikaDTO dohvatiStatistikuIgraca(Long igracId) {
        clanRepository.findById(igracId)
                .orElseThrow(() -> new RuntimeException("Igrač s ID-om " + igracId + " nije pronađen"));

        List<MecDTO> meceviIgracaDTO = mecRepository.findAll()
                .stream()
                .filter(mec -> mec.getIgrac1() != null && mec.getIgrac2() != null)
                .filter(mec -> igracId.equals(mec.getIgrac1().getId()) ||
                        igracId.equals(mec.getIgrac2().getId()))
                .map(mec -> {
                    MecDTO mecDTO = new MecDTO();
                    mecDTO.setLigaId(mec.getLiga() != null ? mec.getLiga().getId() : null);
                    mecDTO.setIgrac1Id(mec.getIgrac1() != null ? mec.getIgrac1().getId() : null);
                    mecDTO.setIgrac2Id(mec.getIgrac2() != null ? mec.getIgrac2().getId() : null);
                    mecDTO.setDatum(mec.getDatum());
                    mecDTO.setVrijeme(mec.getVrijeme());
                    mecDTO.setRezultat(mec.getRezultat());
                    mecDTO.setStatus(mec.getStatus());
                    return mecDTO;
                })
                .collect(Collectors.toList());
        System.out.println("Mecevi igraca: " + meceviIgracaDTO);
        return new StatistikaDTO(igracId, meceviIgracaDTO);
    }
}