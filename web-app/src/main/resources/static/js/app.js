// orchestration: reacts to events, calls the api and asks the ui to draw

import * as catalog from './api/catalog.js';
import * as reviews from './api/reviews.js';
import { elements, showPlaceholder, showMessage, clearMessage } from './ui/dom.js';
import { gameCard, markSelected } from './ui/games-view.js';
import { reviewCard, summaryText } from './ui/reviews-view.js';

let selectedGame = null;

async function loadGames() {
  try {
    const games = await catalog.listGames();
    elements.gameList.replaceChildren(...games.map(g => gameCard(g, selectGame)));
  } catch (error) {
    showPlaceholder(elements.gameList, 'catálogo indisponível no momento');
  }
}

function selectGame(game, card) {
  selectedGame = game;
  markSelected(card);
  elements.reviewsTitle.textContent = 'Resenhas de ' + game.title;
  elements.formCard.hidden = false;
  clearMessage();
  loadReviews();
}

async function loadReviews() {
  try {
    const [list, summary] = await Promise.all([
      reviews.listByGame(selectedGame.id),
      reviews.summaryByGame(selectedGame.id)
    ]);

    elements.summary.textContent = summaryText(summary);

    if (list.length === 0) {
      showPlaceholder(elements.reviewList, 'nenhuma resenha ainda, seja o primeiro');
      return;
    }
    elements.reviewList.replaceChildren(...list.map(reviewCard));
  } catch (error) {
    elements.summary.textContent = '';
    showPlaceholder(elements.reviewList, 'resenhas indisponíveis no momento');
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
        ? 'resenha publicada!'
        : 'resenha publicada, mas o catálogo está fora do ar (será verificada depois)',
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
