package br.edu.infnet.review.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

// kicks in when the catalog fails (timeout, service down, circuit open)
@Component
public class CatalogClientFallback implements CatalogClient {

    private static final Logger log = LoggerFactory.getLogger(CatalogClientFallback.class);

    @Override
    public GameSummary getGame(Long id) {
        log.warn("catalog-service indisponivel, seguindo sem verificar o jogo {}", id);
        return GameSummary.UNAVAILABLE;
    }
}
