package br.edu.infnet.catalog.service;

import br.edu.infnet.catalog.dto.GameRequest;
import br.edu.infnet.catalog.model.Game;
import br.edu.infnet.catalog.repository.GameRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class GameService {

    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public List<Game> findAll() {
        return repository.findAll();
    }

    public Game findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Jogo " + id + " nao encontrado"));
    }

    public Game create(GameRequest request) {
        Game game = new Game(request.title(), request.genre(), request.platform(),
                request.releaseYear(), request.developer());
        return repository.save(game);
    }

    public Game update(Long id, GameRequest request) {
        Game game = findById(id);
        game.setTitle(request.title());
        game.setGenre(request.genre());
        game.setPlatform(request.platform());
        game.setReleaseYear(request.releaseYear());
        game.setDeveloper(request.developer());
        return repository.save(game);
    }

    public void delete(Long id) {
        // load first so a missing id returns 404 instead of failing silently
        Game game = findById(id);
        repository.delete(game);
    }
}
