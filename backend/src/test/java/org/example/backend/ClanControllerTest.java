package org.example.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.controllers.ClanController;
import org.example.backend.dto.ClanDTO;
import org.example.backend.model.Clan;
import org.example.backend.model.Liga;
import org.example.backend.service.ClanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClanController.class)
@Import(TestSecurityConfig.class)
public class ClanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClanService clanService;

    @Autowired
    private ObjectMapper objectMapper;

    private Clan testClan;
    private ClanDTO testClanDTO;
    private Liga testLiga;

    @BeforeEach
    void setUp() {
        reset(clanService);

        testLiga = new Liga();
        testLiga.setId(1L);
        testLiga.setNaziv("Test Liga");

        testClan = new Clan();
        testClan.setId(1L);
        testClan.setIme("Ivan");
        testClan.setPrezime("Horvat");
        testClan.setEmail("ivan.horvat@example.com");

        testClanDTO = new ClanDTO();
        testClanDTO.setIme("Ivan");
        testClanDTO.setPrezime("Horvat");
        testClanDTO.setEmail("ivan.horvat@example.com");
    }

    @Test
    void dohvatiSveClanove_shouldReturnAllMembers() throws Exception {
        List<Clan> clanovi = Arrays.asList(testClan);
        when(clanService.dohvatiSveClanove()).thenReturn(clanovi);

        mockMvc.perform(get("/api/clan/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].ime", is("Ivan")))
                .andExpect(jsonPath("$[0].prezime", is("Horvat")))
                .andExpect(jsonPath("$[0].email", is("ivan.horvat@example.com")));

        verify(clanService).dohvatiSveClanove();
    }

    @Test
    void dohvatiClana_shouldReturnMember() throws Exception {
        when(clanService.dohvatiClanaPremId(1L)).thenReturn(testClan);

        mockMvc.perform(get("/api/clan/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.ime", is("Ivan")))
                .andExpect(jsonPath("$.prezime", is("Horvat")));

        verify(clanService).dohvatiClanaPremId(1L);
    }

    @Test
    void dohvatiClana_shouldReturn404WhenNotFound() throws Exception {
        when(clanService.dohvatiClanaPremId(99L)).thenReturn(null);

        mockMvc.perform(get("/api/clan/99"))
                .andExpect(status().isNotFound());

        verify(clanService).dohvatiClanaPremId(99L);
    }

    @Test
    void kreirajClana_shouldCreateMember() throws Exception {
        when(clanService.kreirajClana(any(ClanDTO.class))).thenReturn(testClan);

        mockMvc.perform(post("/api/clan/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testClanDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.ime", is("Ivan")))
                .andExpect(jsonPath("$.prezime", is("Horvat")));

        verify(clanService).kreirajClana(any(ClanDTO.class));
    }

    @Test
    void azurirajClana_shouldUpdateMember() throws Exception {
        testClanDTO.setIme("Marko");
        Clan updatedClan = new Clan();
        updatedClan.setId(1L);
        updatedClan.setIme("Marko");
        updatedClan.setPrezime("Horvat");
        updatedClan.setEmail("ivan.horvat@example.com");

        when(clanService.azurirajClana(eq(1L), any(ClanDTO.class))).thenReturn(updatedClan);

        mockMvc.perform(post("/api/clan/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testClanDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.ime", is("Marko")));

        verify(clanService).azurirajClana(eq(1L), any(ClanDTO.class));
    }

    @Test
    void obrisiClana_shouldDeleteMember() throws Exception {
        doNothing().when(clanService).obrisiClana(1L);

        mockMvc.perform(delete("/api/clan/delete/1"))
                .andExpect(status().isNoContent());

        verify(clanService).obrisiClana(1L);
    }

}