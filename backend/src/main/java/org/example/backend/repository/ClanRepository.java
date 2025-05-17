package org.example.backend.repository;

import org.example.backend.model.Clan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClanRepository extends JpaRepository<Clan, Long> {
    Optional<Clan> findByEmail(String email);
    Boolean existsByEmail(String email);
}