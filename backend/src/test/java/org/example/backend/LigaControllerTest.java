package org.example.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.controllers.LigaController;
import org.example.backend.dto.LigaDTO;
import org.example.backend.model.Liga;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusLige;
import org.example.backend.service.LigaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LigaController.class)
@Import(TestSecurityConfig.class)
public class LigaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LigaService ligaService;

    @Autowired
    private ObjectMapper objectMapper;

    private Liga testLiga;
    private LigaDTO testLigaDTO;
    private Mec testMec;

    @BeforeEach
    void setUp() {
        reset(ligaService);

        testLiga = new Liga();
        testLiga.setId(1L);
        testLiga.setNaziv("Test Liga");
        testLiga.setDatumPocetka(LocalDate.now());
        testLiga.setDatumZavrsetka(LocalDate.now().plusMonths(1));
        testLiga.setFormat("Round Robin");
        testLiga.setMax_igraca(8);
        testLiga.setStatus(StatusLige.AKTIVNA);

        testLigaDTO = new LigaDTO(testLiga);

        testMec = new Mec();
        testMec.setId(1L);
        testMec.setLiga(testLiga);
    }

    @Test
    void dohvatiSveLige_shouldReturnAllLeagues() throws Exception {
        when(ligaService.dohvatiSveLige()).thenReturn(Arrays.asList(testLiga));

        mockMvc.perform(get("/api/liga/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].naziv", is("Test Liga")))
                .andExpect(jsonPath("$[0].status", is("AKTIVNA")));
    }

    @Test
    void dohvatiLiguPoNazivu_shouldReturnLeague() throws Exception {
        when(ligaService.dohvatiLiguPremIme("Test Liga")).thenReturn(testLiga);

        mockMvc.perform(get("/api/liga/Test Liga"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naziv", is("Test Liga")));

    }

    @Test
    void dohvatiLiguPoNazivu_shouldReturn404WhenNotFound() throws Exception {
        when(ligaService.dohvatiLiguPremIme("Nonexistent")).thenReturn(null);

        mockMvc.perform(get("/api/liga/Nonexistent"))
                .andExpect(status().isNotFound());

    }

    @Test
    void kreirajLigu_shouldCreateLeague() throws Exception {
        when(ligaService.kreirajLigu(any(LigaDTO.class))).thenReturn(testLiga);

        mockMvc.perform(post("/api/liga/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLigaDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naziv", is("Test Liga")));

    }

    @Test
    void azurirajLigu_shouldUpdateLeague() throws Exception {
        testLigaDTO.setNaziv("Updated Liga");
        Liga updatedLiga = new Liga();
        updatedLiga.setId(1L);
        updatedLiga.setNaziv("Updated Liga");
        updatedLiga.setStatus(StatusLige.AKTIVNA);

        when(ligaService.azurirajLigu(eq(1L), any(LigaDTO.class))).thenReturn(updatedLiga);

        mockMvc.perform(post("/api/liga/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLigaDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naziv", is("Updated Liga")));

    }

    @Test
    void obrisiLigu_shouldDeleteLeague() throws Exception {
        doNothing().when(ligaService).obrisiLigu(1L);

        mockMvc.perform(delete("/api/liga/delete/1"))
                .andExpect(status().isNoContent());

    }

    @Test
    void dohvatiMeceveLige_shouldReturnMatches() throws Exception {
        List<Mec> mecevi = Collections.singletonList(testMec);
        when(ligaService.dohvatiSveMecevePremLiga("Test Liga")).thenReturn(mecevi);

        mockMvc.perform(get("/api/liga/Test Liga/mecevi"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)));

    }
}