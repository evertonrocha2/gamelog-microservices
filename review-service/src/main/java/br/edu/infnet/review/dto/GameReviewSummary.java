package br.edu.infnet.review.dto;

public record GameReviewSummary(Long gameId, long totalReviews, double averageRating) {
}
