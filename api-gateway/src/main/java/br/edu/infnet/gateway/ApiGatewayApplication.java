package br.edu.infnet.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * API Gateway. Unico ponto de entrada da aplicacao.
 * As rotas ficam no application.yml e o roteamento usa o Eureka,
 * entao o cliente nunca precisa saber a porta interna de cada servico.
 */
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
