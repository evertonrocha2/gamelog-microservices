package br.edu.infnet.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ReviewRequest(
        @NotNull(message = "gameId e obrigatorio") Long gameId,
        @NotBlank(message = "author e obrigatorio") String author,
        @Min(value = 1, message = "rating vai de 1 a 5")
        @Max(value = 5, message = "rating vai de 1 a 5")
        int rating,
        @NotBlank(message = "text e obrigatorio") String text,
        List<String> pros,
        List<String> cons,
        String platform,
        Integer hoursPlayed) {
}
