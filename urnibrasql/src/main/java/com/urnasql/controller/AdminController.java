package com.urnasql.controller;

import com.urnasql.model.Candidato;
import com.urnasql.model.Votante;
import com.urnasql.repository.CandidatoRepository;
import com.urnasql.repository.VotanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import java.nio.file.StandardCopyOption;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import java.io.File;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final CandidatoRepository candidatoRepository;
    private final VotanteRepository votanteRepository;
    private final String UPLOAD_DIR = "./uploads/";

    @PostMapping(value = "/candidatos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Candidato> criarCandidato(
            @RequestPart("nome") String nome,  // Mudado de @RequestParam para @RequestPart
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        System.out.println("Nome recebido: " + nome); // Debug
        if (foto != null) {
            System.out.println("Foto recebida: " + foto.getOriginalFilename()); // Debug
        }

        try {
            Candidato candidato = new Candidato();
            candidato.setNome(nome);

            if (foto != null && !foto.isEmpty()) {
                // Garante que o diretório existe
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Gera nome único para o arquivo
                String fileName = UUID.randomUUID() + "-" + foto.getOriginalFilename();

                // Salva o arquivo
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(foto.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Armazena a URL no candidato
                candidato.setFotoUrl("/uploads/" + fileName);
            }

            return ResponseEntity.ok(candidatoRepository.save(candidato));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
