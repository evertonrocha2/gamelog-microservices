package br.edu.infnet.review.client;

/**
 * Versao resumida do jogo que vem do catalog-service.
 * O UNAVAILABLE e um marcador devolvido pelo fallback quando o
 * catalogo esta fora do ar (diferente de null, que significa jogo inexistente).
 */
public record GameSummary(Long id, String title) {

    public static final GameSummary UNAVAILABLE = new GameSummary(-1L, null);

    public boolean isUnavailable() {
        return this == UNAVAILABLE;
    }
}
