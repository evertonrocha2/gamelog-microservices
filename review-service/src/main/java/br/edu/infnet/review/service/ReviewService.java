package br.edu.infnet.review.service;

import br.edu.infnet.review.client.CatalogClient;
import br.edu.infnet.review.client.GameSummary;
import br.edu.infnet.review.dto.GameReviewSummary;
import br.edu.infnet.review.dto.ReviewRequest;
import br.edu.infnet.review.model.Review;
import br.edu.infnet.review.repository.ReviewRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReviewService {

    private final ReviewRepository repository;
    private final CatalogClient catalogClient;

    public ReviewService(ReviewRepository repository, CatalogClient catalogClient) {
        this.repository = repository;
        this.catalogClient = catalogClient;
    }

    public Review create(ReviewRequest request) {
        GameSummary game = catalogClient.getGame(request.gameId());

        // on a 404, feign (dismiss404) returns an all-null object instead of throwing
        if (game == null || (!game.isUnavailable() && game.id() == null)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Jogo " + request.gameId() + " nao existe no catalogo");
        }

        Review review = new Review();
        review.setGameId(request.gameId());
        review.setAuthor(request.author());
        review.setRating(request.rating());
        review.setText(request.text());
        review.setPros(request.pros());
        review.setCons(request.cons());
        review.setPlatform(request.platform());
        review.setHoursPlayed(request.hoursPlayed());
        review.setCreatedAt(Instant.now());

        if (game.isUnavailable()) {
            // catalog down: accept it anyway, just flag it as unverified
            review.setGameVerified(false);
        } else {
            review.setGameTitle(game.title());
            review.setGameVerified(true);
        }

        return repository.save(review);
    }

    public List<Review> findAll() {
        return repository.findAll();
    }

    public Review findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Resenha " + id + " nao encontrada"));
    }

    public List<Review> findByGame(Long gameId) {
        return repository.findByGameId(gameId);
    }

    public GameReviewSummary summarizeGame(Long gameId) {
        List<Review> reviews = repository.findByGameId(gameId);
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        return new GameReviewSummary(gameId, reviews.size(), Math.round(average * 100.0) / 100.0);
    }

    public void delete(String id) {
        Review review = findById(id);
        repository.delete(review);
    }
}
