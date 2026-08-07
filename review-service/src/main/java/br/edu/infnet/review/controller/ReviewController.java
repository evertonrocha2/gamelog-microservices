package br.edu.infnet.review.controller;

import br.edu.infnet.review.dto.GameReviewSummary;
import br.edu.infnet.review.dto.ReviewRequest;
import br.edu.infnet.review.model.Review;
import br.edu.infnet.review.service.ReviewService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<Review> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Review findById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping("/game/{gameId}")
    public List<Review> findByGame(@PathVariable Long gameId) {
        return service.findByGame(gameId);
    }

    @GetMapping("/game/{gameId}/summary")
    public GameReviewSummary summarizeGame(@PathVariable Long gameId) {
        return service.summarizeGame(gameId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review create(@Valid @RequestBody ReviewRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
