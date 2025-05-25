package org.example.backend;

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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;

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

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class MecIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private MecController mecController;

    @SpyBean
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
        mockMvc = MockMvcBuilders.standaloneSetup(mecController).build();

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
    void dohvatiSveMeceve_shouldCallServiceMethod() throws Exception {
        List<Mec> mecevi = Arrays.asList(testMec);

        doReturn(mecevi).when(mecService).dohvatiSveMeceve();

        mockMvc.perform(get("/api/mec/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].ligaNaziv", is("Test Liga")));

        verify(mecService, times(1)).dohvatiSveMeceve();
    }

    @Test
    void dohvatiMecevePremaNazivuLige_shouldCallServiceWithCorrectParameter() throws Exception {
        List<Mec> mecevi = Arrays.asList(testMec);
        String ligaNaziv = "Test Liga";

        doReturn(mecevi).when(mecService).dohvatiMecPremLiga(ligaNaziv);

        mockMvc.perform(get("/api/mec/liga/" + ligaNaziv))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].ligaNaziv", is(ligaNaziv)));

        verify(mecService, times(1)).dohvatiMecPremLiga(eq(ligaNaziv));
    }

    @Test
    void kreirajMec_shouldCallServiceWithCorrectDTO() throws Exception {
        doReturn(testMec).when(mecService).kreirajMec(any(MecDTO.class));

        mockMvc.perform(post("/api/mec/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testMecDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ligaNaziv", is("Test Liga")))
                .andExpect(jsonPath("$.igrac1Ime", is("Ivan Horvat")));

        verify(mecService, times(1)).kreirajMec(any(MecDTO.class));
    }

    @Test
    void azurirajMec_shouldCallServiceWithCorrectIdAndDTO() throws Exception {
        testMecDTO.setStatus(StatusMeca.ZAVRSEN);
        testMecDTO.setRezultat("3:0");

        testMec.setStatus(StatusMeca.ZAVRSEN);
        testMec.setRezultat("3:0");

        doReturn(testMec).when(mecService).azurirajMec(eq(1L), any(MecDTO.class));

        mockMvc.perform(post("/api/mec/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testMecDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ZAVRSEN")))
                .andExpect(jsonPath("$.rezultat", is("3:0")));

        verify(mecService, times(1)).azurirajMec(eq(1L), any(MecDTO.class));
    }

    @Test
    void obrisiMec_shouldCallServiceWithCorrectId() throws Exception {
        doNothing().when(mecService).obrisiMec(1L);

        mockMvc.perform(delete("/api/mec/1"))
                .andExpect(status().isNoContent());

        verify(mecService, times(1)).obrisiMec(1L);
    }
}