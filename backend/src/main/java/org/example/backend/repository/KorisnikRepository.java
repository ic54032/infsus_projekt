package org.example.backend.repository;

import org.example.backend.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface KorisnikRepository extends JpaRepository<Korisnik, Long> {
    Optional<Korisnik> findByEmail(String email);
    boolean existsByEmail(String email);
}