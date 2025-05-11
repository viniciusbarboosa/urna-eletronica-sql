package com.urnasql.controller;

import com.urnasql.model.Candidato;
import com.urnasql.model.Votante;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.urnasql.service.VotacaoService;

import java.util.List;

@RestController
@RequestMapping("/api/votacao")
@RequiredArgsConstructor
public class VotacaoController {
    private final VotacaoService votacaoService;

    @PostMapping("/iniciar")
    public ResponseEntity<String> iniciarVotacao() {
        votacaoService.iniciarVotacao();
        return ResponseEntity.ok("Votação iniciada");
    }

    @PostMapping("/encerrar")
    public ResponseEntity<String> encerrarVotacao() {
        votacaoService.encerrarVotacao();
        return ResponseEntity.ok("Votação encerrada");
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> statusVotacao() {
        return ResponseEntity.ok(votacaoService.isVotacaoAtiva());
    }

    @PostMapping("/votar/{candidatoId}")
    public ResponseEntity<String> votar(
            @PathVariable Long candidatoId,
            @RequestParam String cpfVotante) {
        votacaoService.registrarVoto(candidatoId, cpfVotante);
        return ResponseEntity.ok("Voto registrado com sucesso");
    }

    @GetMapping("/resultados")
    public ResponseEntity<List<Candidato>> resultados() {
        return ResponseEntity.ok(votacaoService.obterResultados());
    }

    @GetMapping("/candidatos")
    public ResponseEntity<List<Candidato>> listarCandidatos() {
        return ResponseEntity.ok(votacaoService.listarCandidatos());
    }
}
