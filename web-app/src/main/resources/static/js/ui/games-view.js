// how a game shows up on screen

export function gameCard(game, onClick) {
  const card = document.createElement('div');
  card.className = 'card game';

  const title = document.createElement('h3');
  title.textContent = game.title;

  const details = document.createElement('p');
  details.textContent = [game.genre, game.platform, game.releaseYear]
    .filter(Boolean)
    .join(' · ');

  card.append(title, details);
  card.onclick = () => onClick(game, card);
  return card;
}

export function markSelected(card) {
  document.querySelectorAll('.game').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}
