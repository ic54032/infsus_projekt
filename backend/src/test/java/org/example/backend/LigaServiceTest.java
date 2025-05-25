package org.example.backend;

import org.example.backend.dto.LigaDTO;
import org.example.backend.model.Liga;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusLige;
import org.example.backend.repository.LigaRepository;
import org.example.backend.repository.MecRepository;
import org.example.backend.service.LigaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LigaServiceTest {

    @Mock
    private LigaRepository ligaRepository;

    @Mock
    private MecRepository mecRepository;

    @InjectMocks
    private LigaService ligaService;

    private Liga testLiga;
    private LigaDTO testLigaDTO;
    private List<Mec> testMecevi;

    @BeforeEach
    void setUp() {
        testLiga = new Liga();
        testLiga.setId(1L);
        testLiga.setNaziv("Test Liga");
        testLiga.setDatumPocetka(LocalDate.now());
        testLiga.setDatumZavrsetka(LocalDate.now().plusMonths(1));
        testLiga.setFormat("Round Robin");
        testLiga.setMax_igraca(8);
        testLiga.setStatus(StatusLige.AKTIVNA);

        testLigaDTO = new LigaDTO(testLiga);

        testMecevi = new ArrayList<>();
        Mec mec = new Mec();
        mec.setId(1L);
        mec.setLiga(testLiga);
        testMecevi.add(mec);
    }

    @Test
    void dohvatiSveLige_shouldReturnAllLeagues() {
        List<Liga> lige = new ArrayList<>();
        lige.add(testLiga);
        when(ligaRepository.findAll()).thenReturn(lige);

        List<Liga> result = ligaService.dohvatiSveLige();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNaziv()).isEqualTo("Test Liga");
        verify(ligaRepository).findAll();
    }

    @Test
    void dohvatiLiguPremIme_shouldReturnLeague_whenExists() {
        when(ligaRepository.findByNaziv("Test Liga")).thenReturn(testLiga);

        Liga result = ligaService.dohvatiLiguPremIme("Test Liga");

        assertNotNull(result);
        assertEquals("Test Liga", result.getNaziv());
        verify(ligaRepository).findByNaziv("Test Liga");
    }

    @Test
    void kreirajLigu_shouldCreateNewLeague() {
        when(ligaRepository.save(any(Liga.class))).thenReturn(testLiga);

        Liga result = ligaService.kreirajLigu(testLigaDTO);

        assertNotNull(result);
        assertEquals("Test Liga", result.getNaziv());
        verify(ligaRepository).save(any(Liga.class));
    }

    @Test
    void azurirajLigu_shouldUpdateLeague() {
        testLigaDTO.setNaziv("Updated Liga");
        when(ligaRepository.findById(1L)).thenReturn(Optional.of(testLiga));
        when(ligaRepository.save(any(Liga.class))).thenAnswer(i -> i.getArgument(0));

        Liga result = ligaService.azurirajLigu(1L, testLigaDTO);

        assertNotNull(result);
        assertEquals("Updated Liga", result.getNaziv());
        verify(ligaRepository).findById(1L);
        verify(ligaRepository).save(any(Liga.class));
    }

    @Test
    void obrisiLigu_shouldDeleteLeague() {
        when(ligaRepository.findById(1L)).thenReturn(Optional.of(testLiga));
        doNothing().when(ligaRepository).delete(any(Liga.class));

        ligaService.obrisiLigu(1L);

        verify(ligaRepository).findById(1L);
        verify(ligaRepository).delete(any(Liga.class));
    }

    @Test
    void dohvatiSveMecevePremLiga_shouldReturnMatchesForLeague() {
        when(ligaRepository.findByNaziv("Test Liga")).thenReturn(testLiga);
        when(mecRepository.findByLigaNaziv(testLiga.getNaziv())).thenReturn(testMecevi);

        List<Mec> result = ligaService.dohvatiSveMecevePremLiga("Test Liga");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLiga().getNaziv()).isEqualTo("Test Liga");
        verify(ligaRepository).findByNaziv("Test Liga");
        verify(mecRepository).findByLigaNaziv(testLiga.getNaziv());
    }
}