package com.urnasql.repository;

import com.urnasql.model.Votante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface VotanteRepository extends JpaRepository<Votante, Long> {
    Optional<Votante> findByCpf(String cpf);

    @Modifying
    @Transactional
    @Query("UPDATE Votante v SET v.votou = false")
    void resetarStatusVotacao();
}