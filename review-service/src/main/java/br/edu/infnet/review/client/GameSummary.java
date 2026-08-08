package br.edu.infnet.review.client;

public record GameSummary(Long id, String title) {

    // devolvido pelo fallback quando o catalogo esta fora do ar
    public static final GameSummary UNAVAILABLE = new GameSummary(-1L, null);

    public boolean isUnavailable() {
        return this == UNAVAILABLE;
    }
}
