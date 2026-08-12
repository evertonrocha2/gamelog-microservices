package br.edu.infnet.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// dismiss404: a missing game must not count as a failure and trip the circuit
@FeignClient(name = "catalog-service", fallback = CatalogClientFallback.class, dismiss404 = true)
public interface CatalogClient {

    @GetMapping("/api/games/{id}")
    GameSummary getGame(@PathVariable("id") Long id);
}
