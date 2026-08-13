// how a game shows up in the catalog column

export function gameCard(game, onSelect) {
  // a button, not a div: the list is keyboard reachable and announces its state
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'game';
  card.setAttribute('aria-pressed', 'false');

  const title = document.createElement('span');
  title.className = 'game-title';
  title.textContent = game.title;

  const meta = document.createElement('span');
  meta.className = 'game-meta';
  meta.textContent = [game.genre, game.platform, game.releaseYear]
    .filter(Boolean)
    .join(' · ');

  card.append(title, meta);
  card.onclick = () => onSelect(game, card);
  return card;
}

export function markSelected(card) {
  document.querySelectorAll('.game').forEach(c => c.setAttribute('aria-pressed', 'false'));
  card.setAttribute('aria-pressed', 'true');
}
