package org.example.backend.repository;

import org.example.backend.model.Liga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigaRepository extends JpaRepository<Liga, Long> {
    Liga findByNaziv(String naziv);

    Boolean existsByNaziv(String naziv);


}
