package br.edu.infnet.catalog.controller;

import br.edu.infnet.catalog.dto.GameRequest;
import br.edu.infnet.catalog.model.Game;
import br.edu.infnet.catalog.service.GameService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * O caminho ja inclui /api/games porque o gateway repassa a rota
 * inteira, sem reescrever o path.
 */
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping
    public List<Game> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Game findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Game create(@Valid @RequestBody GameRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Game update(@PathVariable Long id, @Valid @RequestBody GameRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
