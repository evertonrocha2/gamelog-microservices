package br.edu.infnet.catalog.config;

import br.edu.infnet.catalog.model.Game;
import br.edu.infnet.catalog.repository.GameRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// carga inicial pra nao comecar com o catalogo vazio
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(GameRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            repository.save(new Game("The Legend of Zelda: Breath of the Wild", "Aventura", "Switch", 2017, "Nintendo"));
            repository.save(new Game("Elden Ring", "RPG de acao", "PC", 2022, "FromSoftware"));
            repository.save(new Game("Hollow Knight", "Metroidvania", "PC", 2017, "Team Cherry"));
            repository.save(new Game("Stardew Valley", "Simulacao", "PC", 2016, "ConcernedApe"));
        };
    }
}
