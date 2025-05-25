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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

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

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class LigaIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private LigaController ligaController;

    @SpyBean
    private LigaService ligaService;

    @Autowired
    private ObjectMapper objectMapper;

    private Liga testLiga;
    private LigaDTO testLigaDTO;
    private Mec testMec;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(ligaController).build();

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
    void dohvatiSveLige_shouldCallServiceMethod() throws Exception {
        List<Liga> lige = Arrays.asList(testLiga);

        doReturn(lige).when(ligaService).dohvatiSveLige();

        mockMvc.perform(get("/api/liga/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].naziv", is("Test Liga")));

        verify(ligaService, times(1)).dohvatiSveLige();
    }

    @Test
    void dohvatiLiguPoNazivu_shouldCallServiceWithCorrectParameter() throws Exception {
        doReturn(testLiga).when(ligaService).dohvatiLiguPremIme("Test Liga");

        mockMvc.perform(get("/api/liga/Test Liga"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naziv", is("Test Liga")));

        verify(ligaService, times(1)).dohvatiLiguPremIme("Test Liga");
    }

    @Test
    void dohvatiLiguPoNazivu_shouldReturn404WhenServiceReturnsNull() throws Exception {
        doReturn(null).when(ligaService).dohvatiLiguPremIme("Nonexistent");

        mockMvc.perform(get("/api/liga/Nonexistent"))
                .andExpect(status().isNotFound());

        verify(ligaService, times(1)).dohvatiLiguPremIme("Nonexistent");
    }

    @Test
    void kreirajLigu_shouldCallServiceWithCorrectDTO() throws Exception {
        doReturn(testLiga).when(ligaService).kreirajLigu(any(LigaDTO.class));

        // Execute the request
        mockMvc.perform(post("/api/liga/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLigaDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naziv", is("Test Liga")));

        verify(ligaService, times(1)).kreirajLigu(any(LigaDTO.class));
    }

    @Test
    void azurirajLigu_shouldCallServiceWithCorrectIdAndDTO() throws Exception {
        testLigaDTO.setNaziv("Updated Liga");
        Liga updatedLiga = new Liga();
        updatedLiga.setId(1L);
        updatedLiga.setNaziv("Updated Liga");
        updatedLiga.setStatus(StatusLige.AKTIVNA);

        doReturn(updatedLiga).when(ligaService).azurirajLigu(eq(1L), any(LigaDTO.class));

        mockMvc.perform(post("/api/liga/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLigaDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naziv", is("Updated Liga")));

        verify(ligaService, times(1)).azurirajLigu(eq(1L), any(LigaDTO.class));
    }

    @Test
    void obrisiLigu_shouldCallServiceWithCorrectId() throws Exception {
        doNothing().when(ligaService).obrisiLigu(1L);

        mockMvc.perform(delete("/api/liga/delete/1"))
                .andExpect(status().isNoContent());

        verify(ligaService, times(1)).obrisiLigu(1L);
    }

    @Test
    void dohvatiMeceveLige_shouldCallServiceWithCorrectParameter() throws Exception {
        List<Mec> mecevi = Collections.singletonList(testMec);

        doReturn(mecevi).when(ligaService).dohvatiSveMecevePremLiga("Test Liga");

        mockMvc.perform(get("/api/liga/Test Liga/mecevi"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)));

        verify(ligaService, times(1)).dohvatiSveMecevePremLiga("Test Liga");
    }
}