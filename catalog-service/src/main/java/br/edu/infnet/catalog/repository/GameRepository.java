package br.edu.infnet.catalog.repository;

import br.edu.infnet.catalog.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
