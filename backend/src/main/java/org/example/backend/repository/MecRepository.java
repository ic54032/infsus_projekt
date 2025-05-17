package org.example.backend.repository;

import org.example.backend.model.Clan;
import org.example.backend.model.Liga;
import org.example.backend.model.Mec;
import org.example.backend.model.enums.StatusMeca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MecRepository extends JpaRepository<Mec, Long> {
    List<Mec> findByLigaNaziv(String naziv);
    List<Mec> findByIgrac1OrIgrac2(Clan igrac1, Clan igrac2);
    List<Mec> findByStatus(StatusMeca status);
    List<Mec> findByDatumBetween(LocalDate pocetak, LocalDate kraj);
}