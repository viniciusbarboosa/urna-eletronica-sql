package com.urnasql.repository;

import com.urnasql.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import java.util.List;

public interface CandidatoRepository extends JpaRepository<Candidato, Long> {
    List<Candidato> findAllByOrderByVotosDesc();

    default List<Candidato> findAllOrderByVotosDesc() {
        return findAll(Sort.by(Sort.Direction.DESC, "votos"));
    }
}
