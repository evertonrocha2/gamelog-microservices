// review-service client
import { get, post } from './http.js';

export function listByGame(gameId) {
  return get(`/api/reviews/game/${gameId}`);
}

export function summaryByGame(gameId) {
  return get(`/api/reviews/game/${gameId}/summary`);
}

export function publish(review) {
  return post('/api/reviews', review);
}
