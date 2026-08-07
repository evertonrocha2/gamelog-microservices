package br.edu.infnet.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record GameRequest(
        @NotBlank(message = "title e obrigatorio") String title,
        String genre,
        String platform,
        @Min(value = 1950, message = "releaseYear invalido")
        @Max(value = 2100, message = "releaseYear invalido")
        Integer releaseYear,
        String developer) {
}
