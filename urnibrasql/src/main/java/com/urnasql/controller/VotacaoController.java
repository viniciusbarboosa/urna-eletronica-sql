package com.urnasql.controller;

import com.urnasql.model.Candidato;
import com.urnasql.model.Votante;
import com.urnasql.repository.CandidatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.urnasql.service.VotacaoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/votacao")
@RequiredArgsConstructor
public class VotacaoController {
    private final VotacaoService votacaoService;
    private final CandidatoRepository candidatoRepository;

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
    public ResponseEntity<?> votar(
            @PathVariable Long candidatoId,
            @RequestParam String cpfVotante) {
        try {
            votacaoService.registrarVoto(candidatoId, cpfVotante);
            return ResponseEntity.ok("Voto registrado com sucesso");
        } catch (IllegalStateException e) {
            String mensagem = switch (e.getMessage()) {
                case "VotacaoEncerrada" -> "A votação não está ativa no momento";
                case "EleitorJaVotou" -> "Este eleitor já votou anteriormente";
                default -> e.getMessage();
            };
            return ResponseEntity.status(HttpStatus.CONFLICT).body(mensagem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao processar voto");
        }
    }

    @GetMapping("/resultados")
    public ResponseEntity<List<Candidato>> resultados() {
        return ResponseEntity.ok(votacaoService.obterResultados());
    }

    @GetMapping("/candidatos")
    public ResponseEntity<List<Candidato>> listarCandidatos() {
        List<Candidato> candidatos = candidatoRepository.findAll();

         candidatos.forEach(c -> {
            if (c.getFotoUrl() != null && !c.getFotoUrl().startsWith("http")) {
                c.setFotoUrl("http://localhost:8080" + c.getFotoUrl());
            }
        });

        return ResponseEntity.ok(candidatos);
    }


}
