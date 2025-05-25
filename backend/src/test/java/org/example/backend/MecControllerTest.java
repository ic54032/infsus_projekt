package org.example.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.controllers.MecController;
import org.example.backend.dto.MecDTO;
import org.example.backend.model.Clan;
import org.example.backend.model.Liga;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusMeca;
import org.example.backend.service.MecService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.context.annotation.Import;

@WebMvcTest(MecController.class)
@Import(TestSecurityConfig.class)
public class MecControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MecService mecService;

    @Autowired
    private ObjectMapper objectMapper;

    private Mec testMec;
    private MecDTO testMecDTO;
    private Liga testLiga;
    private Clan testIgrac1;
    private Clan testIgrac2;

    @BeforeEach
    void setUp() {
        testLiga = new Liga();
        testLiga.setId(1L);
        testLiga.setNaziv("Test Liga");

        testIgrac1 = new Clan();
        testIgrac1.setId(1L);
        testIgrac1.setIme("Ivan");
        testIgrac1.setPrezime("Horvat");

        testIgrac2 = new Clan();
        testIgrac2.setId(2L);
        testIgrac2.setIme("Marko");
        testIgrac2.setPrezime("Kovač");

        testMec = new Mec();
        testMec.setId(1L);
        testMec.setLiga(testLiga);
        testMec.setIgrac1(testIgrac1);
        testMec.setIgrac2(testIgrac2);
        testMec.setDatum(LocalDate.now());
        testMec.setVrijeme(LocalTime.of(14, 0));
        testMec.setStatus(StatusMeca.ZAKAZAN);

        testMecDTO = new MecDTO();
        testMecDTO.setLigaId(1L);
        testMecDTO.setIgrac1Id(1L);
        testMecDTO.setIgrac2Id(2L);
        testMecDTO.setDatum(LocalDate.now());
        testMecDTO.setVrijeme(LocalTime.of(14, 0));
        testMecDTO.setStatus(StatusMeca.ZAKAZAN);
    }

    @Test
    void dohvatiSveMeceve_shouldReturnAllMatches() throws Exception {
        List<Mec> mecevi = Arrays.asList(testMec);
        when(mecService.dohvatiSveMeceve()).thenReturn(mecevi);

        mockMvc.perform(get("/api/mec/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].ligaNaziv", is("Test Liga")))
                .andExpect(jsonPath("$[0].igrac1Ime", is("Ivan Horvat")))
                .andExpect(jsonPath("$[0].igrac2Ime", is("Marko Kovač")))
                .andExpect(jsonPath("$[0].status", is("ZAKAZAN")));

    }

    @Test
    void dohvatiMecevePremaNazivuLige_shouldReturnMatchesByLeague() throws Exception {
        List<Mec> mecevi = Arrays.asList(testMec);
        when(mecService.dohvatiMecPremLiga("Test Liga")).thenReturn(mecevi);

        mockMvc.perform(get("/api/mec/liga/Test Liga"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].ligaNaziv", is("Test Liga")));

    }

    @Test
    void kreirajMec_shouldCreateNewMatch() throws Exception {
        when(mecService.kreirajMec(any(MecDTO.class))).thenReturn(testMec);

        mockMvc.perform(post("/api/mec/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testMecDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.ligaNaziv", is("Test Liga")))
                .andExpect(jsonPath("$.igrac1Ime", is("Ivan Horvat")))
                .andExpect(jsonPath("$.igrac2Ime", is("Marko Kovač")))
                .andExpect(jsonPath("$.status", is("ZAKAZAN")));

    }

    @Test
    void azurirajMec_shouldUpdateExistingMatch() throws Exception {
        testMecDTO.setStatus(StatusMeca.ZAVRSEN);
        testMecDTO.setRezultat("3:0");

        testMec.setStatus(StatusMeca.ZAVRSEN);
        testMec.setRezultat("3:0");

        when(mecService.azurirajMec(eq(1L), any(MecDTO.class))).thenReturn(testMec);

        mockMvc.perform(post("/api/mec/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testMecDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.status", is("ZAVRSEN")))
                .andExpect(jsonPath("$.rezultat", is("3:0")));

    }

    @Test
    void obrisiMec_shouldDeleteMatch() throws Exception {
        doNothing().when(mecService).obrisiMec(1L);

        mockMvc.perform(delete("/api/mec/1"))
                .andExpect(status().isNoContent());

    }
}