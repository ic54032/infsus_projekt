package org.example.backend;

import org.example.backend.dto.ClanDTO;
import org.example.backend.model.Clan;
import org.example.backend.model.Liga;
import org.example.backend.repository.ClanRepository;
import org.example.backend.repository.LigaRepository;
import org.example.backend.service.ClanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClanServiceTest {

    @Mock
    private ClanRepository clanRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private LigaRepository ligaRepository;

    @InjectMocks
    private ClanService clanService;

    private Clan testClan;
    private ClanDTO testClanDTO;
    private Liga testLiga;

    @BeforeEach
    void setUp() {
        testClan = new Clan();
        testClan.setId(1L);
        testClan.setIme("Ivan");
        testClan.setPrezime("Horvat");
        testClan.setEmail("ivan.horvat@example.com");

        testClanDTO = new ClanDTO();
        testClanDTO.setIme("Ivan");
        testClanDTO.setPrezime("Horvat");
        testClanDTO.setEmail("ivan.horvat@example.com");

        testLiga = new Liga();
        testLiga.setId(1L);
        testLiga.setNaziv("Test Liga");
    }

    @Test
    void dohvatiSveClanove_shouldReturnAllMembers() {
        List<Clan> clanovi = new ArrayList<>();
        clanovi.add(testClan);
        when(clanRepository.findAll()).thenReturn(clanovi);

        List<Clan> result = clanService.dohvatiSveClanove();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIme()).isEqualTo("Ivan");
        verify(clanRepository).findAll();
    }

    @Test
    void dohvatiClana_shouldReturnMember_whenExists() {
        when(clanRepository.findById(1L)).thenReturn(Optional.of(testClan));

        Clan result = clanService.dohvatiClanaPremId(1L);

        assertNotNull(result);
        assertEquals("Ivan", result.getIme());
        verify(clanRepository).findById(1L);
    }

    @Test
    void dohvatiClana_shouldReturnNull_whenDoesNotExist() {
        when(clanRepository.findById(99L)).thenReturn(Optional.empty());

        Clan result = clanService.dohvatiClanaPremId(99L);

        assertNull(result);
        verify(clanRepository).findById(99L);
    }

    @Test
    void kreirajClana_shouldCreateNewMember() {
        when(clanRepository.existsByEmail("ivan.horvat@example.com")).thenReturn(false);
        when(clanRepository.save(any(Clan.class))).thenReturn(testClan);
        when(passwordEncoder.encode(any(String.class))).thenReturn("encodedPassword");

        Clan result = clanService.kreirajClana(testClanDTO);

        assertNotNull(result);
        assertEquals("Ivan", result.getIme());
        assertEquals("Horvat", result.getPrezime());
        verify(clanRepository).existsByEmail("ivan.horvat@example.com");
        verify(clanRepository).save(any(Clan.class));
        verify(passwordEncoder).encode(any(String.class));
    }

    @Test
    void kreirajClana_shouldThrowException_whenEmailExists() {
        when(clanRepository.existsByEmail("ivan.horvat@example.com")).thenReturn(true);

        Exception exception = assertThrows(DuplicateKeyException.class, () -> {
            clanService.kreirajClana(testClanDTO);
        });

        assertTrue(exception.getMessage().contains("već postoji"));
        verify(clanRepository).existsByEmail("ivan.horvat@example.com");
        verify(clanRepository, never()).save(any(Clan.class));
    }

    @Test
    void azurirajClana_shouldUpdateMember() {
        testClanDTO.setIme("Marko");
        when(clanRepository.findById(1L)).thenReturn(Optional.of(testClan));
        when(clanRepository.save(any(Clan.class))).thenAnswer(i -> i.getArgument(0));

        Clan result = clanService.azurirajClana(1L, testClanDTO);

        assertNotNull(result);
        assertEquals("Marko", result.getIme());
        verify(clanRepository).findById(1L);
        verify(clanRepository).save(any(Clan.class));
    }

    @Test
    void azurirajClana_shouldThrowException_whenMemberNotFound() {
        when(clanRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            clanService.azurirajClana(99L, testClanDTO);
        });

        assertNotNull(exception.getMessage());
        verify(clanRepository).findById(99L);
        verify(clanRepository, never()).save(any(Clan.class));
    }
}