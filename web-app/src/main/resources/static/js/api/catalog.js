// catalog-service client
import { get } from './http.js';

export function listGames() {
  return get('/api/games');
}

export function findGame(id) {
  return get(`/api/games/${id}`);
}
