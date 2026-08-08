package br.edu.infnet.review.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

// entra em acao quando o catalogo falha (timeout, fora do ar, circuito aberto)
@Component
public class CatalogClientFallback implements CatalogClient {

    private static final Logger log = LoggerFactory.getLogger(CatalogClientFallback.class);

    @Override
    public GameSummary getGame(Long id) {
        log.warn("catalog-service indisponivel, seguindo sem verificar o jogo {}", id);
        return GameSummary.UNAVAILABLE;
    }
}
