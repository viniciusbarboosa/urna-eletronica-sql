package com.urnasql.service;

import com.urnasql.model.Candidato;
import com.urnasql.model.Votante;
import com.urnasql.repository.CandidatoRepository;
import com.urnasql.repository.VotanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VotacaoService {
    private final CandidatoRepository candidatoRepository;
    private final VotanteRepository votanteRepository;

    private boolean votacaoAtiva = false;

    public void iniciarVotacao() {
        candidatoRepository.resetarVotos();
        votanteRepository.resetarStatusVotacao();

        votacaoAtiva = true;
    }
    public void encerrarVotacao() {
        votacaoAtiva = false;
    }

    public boolean isVotacaoAtiva() {
        return votacaoAtiva;
    }

    public List<Candidato> listarCandidatos() {
        return candidatoRepository.findAll();
    }

    public void registrarVoto(Long candidatoId, String cpfVotante) {
        if (!votacaoAtiva) {
            throw new RuntimeException("Votação não está ativa");
        }

        Votante votante = votanteRepository.findByCpf(cpfVotante)
                .orElseThrow(() -> new RuntimeException("Votante não encontrado"));

        if (votante.isVotou()) {
            throw new RuntimeException("Votante já votou");
        }

        Candidato candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado"));

        candidato.setVotos(candidato.getVotos() + 1);
        votante.setVotou(true);

        candidatoRepository.save(candidato);
        votanteRepository.save(votante);
    }

    public List<Candidato> obterResultados() {
        if (votacaoAtiva) {
            throw new RuntimeException("Votação ainda está ativa");
        }
        return candidatoRepository.findAllByOrderByVotosDesc();
    }
}
