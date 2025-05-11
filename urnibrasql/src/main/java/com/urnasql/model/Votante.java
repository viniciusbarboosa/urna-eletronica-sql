package com.urnasql.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Votante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String cpf;

    private boolean votou = false;
}