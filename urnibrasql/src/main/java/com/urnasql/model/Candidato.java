package com.urnasql.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Candidato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private int votos = 0;
}
