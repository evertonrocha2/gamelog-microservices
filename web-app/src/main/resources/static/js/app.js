// orchestration: reacts to events, calls the api and asks the ui to draw

import * as catalog from './api/catalog.js';
import * as reviews from './api/reviews.js';
import { elements, showPlaceholder, showMessage, clearMessage, setBusy } from './ui/dom.js';
import { gameCard, markSelected } from './ui/games-view.js';
import { reviewCard, fillSummary } from './ui/reviews-view.js';

let selectedGame = null;

async function loadGames() {
  try {
    const games = await catalog.listGames();
    if (games.length === 0) {
      showPlaceholder(elements.gameList, 'O catálogo está vazio.');
      return;
    }
    elements.gameList.replaceChildren(...games.map(g => gameCard(g, selectGame)));
  } catch (error) {
    showPlaceholder(elements.gameList, 'O catálogo não respondeu. Confira se o catalog-service está no ar.');
  }
}

function selectGame(game, card) {
  selectedGame = game;
  markSelected(card);
  elements.reviewsFor.textContent = game.title;
  elements.reviewsFor.hidden = false;
  elements.composer.hidden = false;
  clearMessage();
  // drop the previous game's reviews right away instead of leaving them on screen
  showPlaceholder(elements.reviewList, 'Carregando resenhas…');
  loadReviews();
}

async function loadReviews() {
  setBusy(elements.reviewList, true);
  try {
    const [list, summary] = await Promise.all([
      reviews.listByGame(selectedGame.id),
      reviews.summaryByGame(selectedGame.id)
    ]);

    fillSummary(elements.summary, summary);

    if (list.length === 0) {
      showPlaceholder(elements.reviewList, 'Nenhuma resenha ainda. Escreva a primeira.');
      return;
    }
    elements.reviewList.replaceChildren(...list.map(reviewCard));
  } catch (error) {
    fillSummary(elements.summary, { totalReviews: 0 });
    showPlaceholder(elements.reviewList, 'As resenhas não carregaram. Confira se o review-service está no ar.');
  } finally {
    setBusy(elements.reviewList, false);
  }
}

async function submitReview(event) {
  event.preventDefault();
  clearMessage();

  try {
    const created = await reviews.publish({
      gameId: selectedGame.id,
      author: elements.fields.author.value,
      rating: Number(elements.fields.rating.value),
      text: elements.fields.text.value
    });

    // not verified means the catalog was down and the fallback kicked in
    showMessage(
      created.gameVerified
        ? 'Resenha publicada.'
        : 'Resenha publicada. O catálogo está fora do ar, então o jogo ainda não foi verificado.',
      'success'
    );
    elements.form.reset();
    loadReviews();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

elements.form.addEventListener('submit', submitReview);
loadGames();
