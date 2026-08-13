// how a review shows up on screen.
// everything through textContent: author and text come from the user,
// so no innerHTML around here.

export function reviewCard(review) {
  const card = document.createElement('article');
  card.className = 'review';

  card.append(head(review), body(review));

  // pros and cons are optional in the document, so they only render when present
  const points = pointList(review);
  if (points) {
    card.append(points);
  }

  card.append(verificationBadge(review));
  return card;
}

function head(review) {
  const wrapper = document.createElement('div');
  wrapper.className = 'review-head';

  const avatar = document.createElement('span');
  avatar.className = 'avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = initial(review.author);

  const identity = document.createElement('div');
  const author = document.createElement('div');
  author.className = 'review-author';
  author.textContent = review.author;
  identity.append(author);

  const meta = metaLine(review);
  if (meta) {
    identity.append(meta);
  }

  wrapper.append(avatar, identity, stars(review.rating));
  return wrapper;
}

function body(review) {
  const text = document.createElement('p');
  text.className = 'review-text';
  text.textContent = review.text;
  return text;
}

// platform, hours played and date are all optional
function metaLine(review) {
  const parts = [review.platform];
  if (review.hoursPlayed) {
    parts.push(review.hoursPlayed + ' h');
  }
  parts.push(formatDate(review.createdAt));

  const filled = parts.filter(Boolean);
  if (filled.length === 0) {
    return null;
  }

  const meta = document.createElement('div');
  meta.className = 'review-meta';
  meta.textContent = filled.join(' · ');
  return meta;
}

function pointList(review) {
  const pros = review.pros ?? [];
  const cons = review.cons ?? [];
  if (pros.length === 0 && cons.length === 0) {
    return null;
  }

  const list = document.createElement('ul');
  list.className = 'points';
  pros.forEach(p => list.append(point('+', p)));
  cons.forEach(c => list.append(point('−', c)));
  return list;
}

function point(marker, label) {
  const item = document.createElement('li');

  const sign = document.createElement('span');
  sign.className = 'marker';
  sign.setAttribute('aria-hidden', 'true');
  sign.textContent = marker;

  const text = document.createElement('span');
  text.textContent = label;

  item.append(sign, text);
  return item;
}

function stars(rating) {
  const wrapper = document.createElement('span');
  wrapper.className = 'rating';
  wrapper.setAttribute('aria-label', `nota ${rating} de 5`);

  const on = document.createElement('span');
  on.className = 'rating-on';
  on.textContent = '★'.repeat(rating);

  const off = document.createElement('span');
  off.className = 'rating-off';
  off.textContent = '★'.repeat(5 - rating);

  wrapper.append(on, off);
  return wrapper;
}

// the pending badge means the catalog was down when the review was written
function verificationBadge(review) {
  const badge = document.createElement('span');
  badge.className = review.gameVerified ? 'badge verified' : 'badge pending';
  badge.textContent = review.gameVerified
    ? 'jogo verificado'
    : 'não verificado · catálogo estava fora';
  return badge;
}

export function fillSummary(container, summary) {
  container.replaceChildren();
  container.dataset.filled = summary.totalReviews > 0 ? 'true' : 'false';
  if (summary.totalReviews === 0) {
    return;
  }

  const average = document.createElement('span');
  average.className = 'summary-average';
  average.textContent = summary.averageRating.toFixed(1).replace('.', ',');

  const count = document.createElement('span');
  count.className = 'summary-count';
  count.textContent = summary.totalReviews === 1
    ? '1 resenha'
    : summary.totalReviews + ' resenhas';

  container.append(average, stars(Math.round(summary.averageRating)), count);
}

function initial(name) {
  return (name ?? '?').trim().charAt(0).toUpperCase();
}

// pt-BR spells this out as "5 de ago. de 2026", too long for a meta line
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatDate(iso) {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
