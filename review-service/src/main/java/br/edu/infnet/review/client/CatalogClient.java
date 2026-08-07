package br.edu.infnet.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Cliente HTTP do catalog-service, resolvido pelo nome logico no Eureka.
 *
 * dismiss404 = true faz o Feign devolver null quando o catalogo responde 404,
 * em vez de estourar excecao. Assim "jogo nao existe" nao abre o circuit breaker,
 * que fica reservado pra falha de verdade (servico fora, timeout etc).
 */
@FeignClient(name = "catalog-service", fallback = CatalogClientFallback.class, dismiss404 = true)
public interface CatalogClient {

    @GetMapping("/api/games/{id}")
    GameSummary getGame(@PathVariable("id") Long id);
}
