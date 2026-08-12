import { listarJogos, listarResenhas, resumoDoJogo, publicarResenha } from './api.js';
import { cardDeJogo, cardDeResenha, textoDoResumo, aviso } from './render.js';

const tela = {
  jogos: document.getElementById('lista-jogos'),
  resenhas: document.getElementById('lista-resenhas'),
  tituloResenhas: document.getElementById('titulo-resenhas'),
  resumo: document.getElementById('resumo'),
  formCard: document.getElementById('form-card'),
  form: document.getElementById('form-resenha'),
  msg: document.getElementById('msg')
};

let jogoSelecionado = null;

async function carregarJogos() {
  try {
    const jogos = await listarJogos();
    tela.jogos.replaceChildren(...jogos.map(j => cardDeJogo(j, selecionarJogo)));
  } catch (e) {
    aviso(tela.jogos, 'catálogo indisponível no momento');
  }
}

function selecionarJogo(jogo, card) {
  jogoSelecionado = jogo;
  document.querySelectorAll('.game').forEach(c => c.classList.remove('ativo'));
  card.classList.add('ativo');
  tela.tituloResenhas.textContent = 'Resenhas de ' + jogo.title;
  tela.formCard.hidden = false;
  carregarResenhas();
}

async function carregarResenhas() {
  const [resenhas, resumo] = await Promise.all([
    listarResenhas(jogoSelecionado.id),
    resumoDoJogo(jogoSelecionado.id)
  ]);

  tela.resumo.textContent = textoDoResumo(resumo);

  if (resenhas.length === 0) {
    aviso(tela.resenhas, 'nenhuma resenha ainda, seja o primeiro');
    return;
  }
  tela.resenhas.replaceChildren(...resenhas.map(cardDeResenha));
}

async function enviarResenha(evento) {
  evento.preventDefault();
  tela.msg.textContent = '';

  try {
    const criada = await publicarResenha({
      gameId: jogoSelecionado.id,
      author: document.getElementById('autor').value,
      rating: Number(document.getElementById('nota').value),
      text: document.getElementById('texto').value
    });

    tela.msg.className = 'msg sucesso';
    // sem verificacao = o catalogo estava fora e o fallback assumiu
    tela.msg.textContent = criada.gameVerified
      ? 'resenha publicada!'
      : 'resenha publicada, mas o catálogo está fora do ar (será verificada depois)';
    tela.form.reset();
    carregarResenhas();
  } catch (erro) {
    tela.msg.className = 'msg erro';
    tela.msg.textContent = erro.message;
  }
}

tela.form.addEventListener('submit', enviarResenha);
carregarJogos();
