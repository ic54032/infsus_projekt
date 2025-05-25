package org.example.backend;

import org.example.backend.dto.MecDTO;
import org.example.backend.model.Clan;
import org.example.backend.model.Liga;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusMeca;
import org.example.backend.repository.ClanRepository;
import org.example.backend.repository.LigaRepository;
import org.example.backend.repository.MecRepository;
import org.example.backend.service.MecService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MecServiceTest {

    @Mock
    private MecRepository mecRepository;

    @Mock
    private LigaRepository ligaRepository;

    @Mock
    private ClanRepository clanRepository;

    @InjectMocks
    private MecService mecService;

    private Mec testMec;
    private Liga testLiga;
    private Clan testIgrac1;
    private Clan testIgrac2;
    private MecDTO testMecDTO;
    private LocalDate testDatum;

    @BeforeEach
    void setUp() {
        testLiga = new Liga();
        testLiga.setId(1L);
        testLiga.setNaziv("Test Liga");

        testIgrac1 = new Clan();
        testIgrac1.setId(1L);

        testIgrac2 = new Clan();
        testIgrac2.setId(2L);

        testDatum = LocalDate.now();

        testMec = new Mec();
        testMec.setId(1L);
        testMec.setLiga(testLiga);
        testMec.setIgrac1(testIgrac1);
        testMec.setIgrac2(testIgrac2);
        testMec.setDatum(testDatum);
        testMec.setStatus(StatusMeca.ZAKAZAN);

        testMecDTO = new MecDTO();
        testMecDTO.setLigaId(1L);
        testMecDTO.setIgrac1Id(1L);
        testMecDTO.setIgrac2Id(2L);
        testMecDTO.setDatum(testDatum);
        testMecDTO.setVrijeme(LocalTime.NOON);
        testMecDTO.setStatus(StatusMeca.ZAKAZAN);
    }

    @Test
    void dohvatiSveMeceve_shouldReturnAllMatches() {
        when(mecRepository.findAll()).thenReturn(Arrays.asList(testMec));

        List<Mec> result = mecService.dohvatiSveMeceve();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        verify(mecRepository).findAll();
    }

    @Test
    void dohvatiMecPremLiga_shouldReturnMatchesByLeagueName() {
        when(mecRepository.findByLigaNaziv("Test Liga")).thenReturn(Arrays.asList(testMec));

        List<Mec> result = mecService.dohvatiMecPremLiga("Test Liga");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLiga().getNaziv()).isEqualTo("Test Liga");
        verify(mecRepository).findByLigaNaziv("Test Liga");
    }

    @Test
    void dohvatiMecPremIgrac_shouldReturnMatchesByPlayer() {
        when(mecRepository.findByIgrac1OrIgrac2(testIgrac1, testIgrac1)).thenReturn(Arrays.asList(testMec));

        List<Mec> result = mecService.dohvatiMecPremIgrac(testIgrac1);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIgrac1()).isEqualTo(testIgrac1);
        verify(mecRepository).findByIgrac1OrIgrac2(testIgrac1, testIgrac1);
    }

    @Test
    void dohvatiMecPremStatus_shouldReturnMatchesByStatus() {
        when(mecRepository.findByStatus(StatusMeca.ZAKAZAN)).thenReturn(Arrays.asList(testMec));

        List<Mec> result = mecService.dohvatiMecPremStatus(StatusMeca.ZAKAZAN);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(StatusMeca.ZAKAZAN);
        verify(mecRepository).findByStatus(StatusMeca.ZAKAZAN);
    }

    @Test
    void dohvatiMecPremDatum_shouldReturnMatchesByDateRange() {
        LocalDate startDate = LocalDate.now().minusDays(1);
        LocalDate endDate = LocalDate.now().plusDays(1);
        when(mecRepository.findByDatumBetween(startDate, endDate)).thenReturn(Arrays.asList(testMec));

        List<Mec> result = mecService.dohvatiMecPremDatum(startDate, endDate);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDatum()).isEqualTo(testDatum);
        verify(mecRepository).findByDatumBetween(startDate, endDate);
    }

    @Test
    void kreirajMec_shouldCreateMatch() {
        when(ligaRepository.findById(1L)).thenReturn(Optional.of(testLiga));
        when(clanRepository.findById(1L)).thenReturn(Optional.of(testIgrac1));
        when(clanRepository.findById(2L)).thenReturn(Optional.of(testIgrac2));
        when(mecRepository.save(any(Mec.class))).thenReturn(testMec);

        Mec result = mecService.kreirajMec(testMecDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(mecRepository).save(any(Mec.class));
    }

    @Test
    void kreirajMec_shouldThrowExceptionWhenLigaNotFound() {
        when(ligaRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                mecService.kreirajMec(testMecDTO)
        );
        assertThat(exception.getMessage()).contains("Liga s ID-om 1 nije pronađena");
        verify(mecRepository, never()).save(any(Mec.class));
    }

    @Test
    void kreirajMec_shouldThrowExceptionWhenIgrac1NotFound() {
        when(ligaRepository.findById(1L)).thenReturn(Optional.of(testLiga));
        when(clanRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                mecService.kreirajMec(testMecDTO)
        );
        assertThat(exception.getMessage()).contains("Igrac1 s ID-om 1 nije pronađen");
        verify(mecRepository, never()).save(any(Mec.class));
    }

    @Test
    void azurirajMec_shouldUpdateMatch() {
        when(mecRepository.findById(1L)).thenReturn(Optional.of(testMec));
        when(clanRepository.findById(1L)).thenReturn(Optional.of(testIgrac1));
        when(clanRepository.findById(2L)).thenReturn(Optional.of(testIgrac2));
        when(mecRepository.save(any(Mec.class))).thenReturn(testMec);

        testMecDTO.setStatus(StatusMeca.ZAVRSEN);
        testMecDTO.setRezultat("3:0");

        Mec result = mecService.azurirajMec(1L, testMecDTO);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(StatusMeca.ZAVRSEN);
        assertThat(result.getRezultat()).isEqualTo("3:0");
        verify(mecRepository).save(any(Mec.class));
    }

    @Test
    void azurirajMec_shouldThrowExceptionWhenMecNotFound() {
        when(mecRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                mecService.azurirajMec(1L, testMecDTO)
        );
        assertThat(exception.getMessage()).contains("Mec ne postoji");
        verify(mecRepository, never()).save(any(Mec.class));
    }

    @Test
    void obrisiMec_shouldDeleteMatch() {
        when(mecRepository.existsById(1L)).thenReturn(true);
        doNothing().when(mecRepository).deleteById(1L);

        mecService.obrisiMec(1L);

        verify(mecRepository).deleteById(1L);
    }

    @Test
    void obrisiMec_shouldThrowExceptionWhenMecNotFound() {
        when(mecRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                mecService.obrisiMec(1L)
        );
        assertThat(exception.getMessage()).contains("Mec s ID-om 1 nije pronađen");
        verify(mecRepository, never()).deleteById(any());
    }
}