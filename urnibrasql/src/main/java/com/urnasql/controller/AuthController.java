package com.urnasql.controller;

import com.urnasql.model.Usuario;
import com.urnasql.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        Optional<Usuario> userOpt = usuarioRepository.findByLoginAndSenha(usuario.getLogin(), usuario.getSenha());

        return userOpt
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

}