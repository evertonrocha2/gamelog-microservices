package br.edu.infnet.review.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Fallback acionado quando a chamada ao catalogo falha
 * (timeout, servico fora do ar ou circuito aberto).
 * Nao decide nada aqui: so devolve o marcador e deixa o
 * ReviewService escolher como degradar.
 */
@Component
public class CatalogClientFallback implements CatalogClient {

    private static final Logger log = LoggerFactory.getLogger(CatalogClientFallback.class);

    @Override
    public GameSummary getGame(Long id) {
        log.warn("catalog-service indisponivel, seguindo sem verificar o jogo {}", id);
        return GameSummary.UNAVAILABLE;
    }
}
