package com.urnasql.repository;

import com.urnasql.model.Votante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotanteRepository extends JpaRepository<Votante, Long> {
    Optional<Votante> findByCpf(String cpf);
}