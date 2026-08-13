// element lookups in a single place: if an id changes in the html, fix it here

export const elements = {
  gameList: document.getElementById('game-list'),
  gameCount: document.getElementById('game-count'),
  reviewList: document.getElementById('review-list'),
  reviewsFor: document.getElementById('reviews-for'),
  summary: document.getElementById('summary'),
  composer: document.getElementById('composer'),
  form: document.getElementById('review-form'),
  message: document.getElementById('message'),
  submit: document.querySelector('#review-form button[type="submit"]'),
  fields: {
    author: document.getElementById('author'),
    rating: document.getElementById('rating'),
    text: document.getElementById('text')
  }
};

export function showPlaceholder(container, text) {
  const p = document.createElement('p');
  p.className = 'empty';
  p.textContent = text;
  container.replaceChildren(p);
}

export function setBusy(container, busy) {
  container.setAttribute('aria-busy', busy ? 'true' : 'false');
}

export function showMessage(text, kind) {
  elements.message.className = 'message ' + kind;
  elements.message.textContent = text;
}

export function clearMessage() {
  elements.message.textContent = '';
}
