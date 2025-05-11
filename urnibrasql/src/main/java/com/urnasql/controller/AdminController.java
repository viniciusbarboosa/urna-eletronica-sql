package com.urnasql.controller;

import com.urnasql.model.Candidato;
import com.urnasql.model.Votante;
import com.urnasql.repository.CandidatoRepository;
import com.urnasql.repository.VotanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final CandidatoRepository candidatoRepository;
    private final VotanteRepository votanteRepository;

    @PostMapping("/candidatos")
    public ResponseEntity<Candidato> criarCandidato(@RequestBody Candidato candidato) {
        return ResponseEntity.ok(candidatoRepository.save(candidato));
    }

    @PostMapping("/votantes")
    public ResponseEntity<Votante> criarVotante(@RequestBody Votante votante) {
        return ResponseEntity.ok(votanteRepository.save(votante));
    }

    @GetMapping("/votantes")
    public ResponseEntity<List<Votante>> listarVotantes() {
        return ResponseEntity.ok(votanteRepository.findAll());
    }
}
