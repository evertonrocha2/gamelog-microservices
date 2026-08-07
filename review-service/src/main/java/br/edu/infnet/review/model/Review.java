package br.edu.infnet.review.model;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Resenha de um jogo. Documento do Mongo de proposito:
 * cada resenha pode ter campos opcionais (pros, contras, horas jogadas)
 * sem a gente precisar mexer em schema toda vez que algo novo aparecer.
 */
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private Long gameId;

    // titulo copiado do catalogo na hora do cadastro.
    // se o catalogo estiver fora do ar, fica nulo e gameVerified = false
    private String gameTitle;
    private boolean gameVerified;

    private String author;
    private int rating;
    private String text;
    private List<String> pros;
    private List<String> cons;
    private String platform;
    private Integer hoursPlayed;
    private Instant createdAt;

    public Review() {
    }

    public String getId() {
        return id;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getGameTitle() {
        return gameTitle;
    }

    public void setGameTitle(String gameTitle) {
        this.gameTitle = gameTitle;
    }

    public boolean isGameVerified() {
        return gameVerified;
    }

    public void setGameVerified(boolean gameVerified) {
        this.gameVerified = gameVerified;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getPros() {
        return pros;
    }

    public void setPros(List<String> pros) {
        this.pros = pros;
    }

    public List<String> getCons() {
        return cons;
    }

    public void setCons(List<String> cons) {
        this.cons = cons;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Integer getHoursPlayed() {
        return hoursPlayed;
    }

    public void setHoursPlayed(Integer hoursPlayed) {
        this.hoursPlayed = hoursPlayed;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
