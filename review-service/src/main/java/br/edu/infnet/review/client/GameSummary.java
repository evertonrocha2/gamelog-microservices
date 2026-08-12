package br.edu.infnet.review.client;

public record GameSummary(Long id, String title) {

    // returned by the fallback when the catalog is down
    public static final GameSummary UNAVAILABLE = new GameSummary(-1L, null);

    public boolean isUnavailable() {
        return this == UNAVAILABLE;
    }
}
