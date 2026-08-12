// how a review shows up on screen.
// everything through textContent: author and text come from the user,
// so no innerHTML around here.

export function reviewCard(review) {
  const card = document.createElement('div');
  card.className = 'card review';

  const author = document.createElement('span');
  author.className = 'author';
  author.textContent = review.author;

  const rating = document.createElement('span');
  rating.className = 'rating';
  rating.textContent = ' ' + '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating) + ' ';

  const text = document.createElement('p');
  text.className = 'text';
  text.textContent = review.text;

  card.append(author, rating, verificationBadge(review), text);
  return card;
}

// the yellow badge means the review was created while the catalog was down
function verificationBadge(review) {
  const badge = document.createElement('span');
  badge.className = review.gameVerified ? 'badge verified' : 'badge pending';
  badge.textContent = review.gameVerified ? 'verificada' : 'jogo não verificado';
  return badge;
}

export function summaryText(summary) {
  if (summary.totalReviews === 0) {
    return '';
  }
  const plural = summary.totalReviews > 1 ? 's' : '';
  return `nota média ${summary.averageRating} (${summary.totalReviews} resenha${plural})`;
}
