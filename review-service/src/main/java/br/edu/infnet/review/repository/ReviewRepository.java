package br.edu.infnet.review.repository;

import br.edu.infnet.review.model.Review;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByGameId(Long gameId);
}
