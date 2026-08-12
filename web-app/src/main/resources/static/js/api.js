// tudo aqui bate no gateway (mesma origem da pagina), nunca nas portas internas

async function getJson(url) {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('falha em ' + url + ' (' + resp.status + ')');
  }
  return resp.json();
}

export function listarJogos() {
  return getJson('/api/games');
}

export function listarResenhas(gameId) {
  return getJson(`/api/reviews/game/${gameId}`);
}

export function resumoDoJogo(gameId) {
  return getJson(`/api/reviews/game/${gameId}/summary`);
}

export async function publicarResenha(resenha) {
  const resp = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resenha)
  });

  const corpo = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(corpo.message ?? 'erro ao publicar (' + resp.status + ')');
  }
  return corpo;
}
