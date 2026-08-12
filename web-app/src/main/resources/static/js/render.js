// monta os elementos da tela.
// sempre com textContent: texto de resenha e nome de autor vem do usuario,
// entao nada de innerHTML aqui.

export function cardDeJogo(jogo, aoClicar) {
  const card = document.createElement('div');
  card.className = 'card game';

  const nome = document.createElement('h3');
  nome.textContent = jogo.title;

  const detalhes = document.createElement('p');
  detalhes.textContent = [jogo.genre, jogo.platform, jogo.releaseYear]
    .filter(Boolean)
    .join(' · ');

  card.append(nome, detalhes);
  card.onclick = () => aoClicar(jogo, card);
  return card;
}

export function cardDeResenha(resenha) {
  const card = document.createElement('div');
  card.className = 'card resenha';

  const autor = document.createElement('span');
  autor.className = 'autor';
  autor.textContent = resenha.author;

  const nota = document.createElement('span');
  nota.className = 'nota';
  nota.textContent = ' ' + '★'.repeat(resenha.rating) + '☆'.repeat(5 - resenha.rating) + ' ';

  const texto = document.createElement('p');
  texto.className = 'texto';
  texto.textContent = resenha.text;

  card.append(autor, nota, seloDeVerificacao(resenha), texto);
  return card;
}

// o selo amarelo aparece quando a resenha foi criada com o catalogo fora do ar
function seloDeVerificacao(resenha) {
  const selo = document.createElement('span');
  selo.className = resenha.gameVerified ? 'selo ok' : 'selo pendente';
  selo.textContent = resenha.gameVerified ? 'verificada' : 'jogo não verificado';
  return selo;
}

export function textoDoResumo(resumo) {
  if (resumo.totalReviews === 0) {
    return '';
  }
  const plural = resumo.totalReviews > 1 ? 's' : '';
  return `nota média ${resumo.averageRating} (${resumo.totalReviews} resenha${plural})`;
}

export function aviso(container, mensagem) {
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = 'vazio';
  p.textContent = mensagem;
  container.appendChild(p);
}
