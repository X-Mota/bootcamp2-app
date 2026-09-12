const area = document.getElementById("resultado");
const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");

async function buscarSerie(termo) {
  area.innerHTML = "<p class='dica'>Carregando...</p>";

  try {
    const resposta = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${termo}`);

    if (!resposta.ok) {
      throw new Error("Série não encontrada");
    }

    const dados = await resposta.json();
    exibirSerie(dados);

  } catch (erro) {
    area.innerHTML = `
      <p class="erro">Não encontramos "${termo}".</p>
      <p class="dica">Verifique o nome da série e tente novamente.</p>
    `;
  }
}

function limparHtml(texto) {
  const div = document.createElement("div");
  div.innerHTML = texto || "Sinopse não disponível.";
  return div.textContent;
}

function exibirSerie(serie) {
  const poster = serie.image ? serie.image.medium : "";
  const nota = serie.rating && serie.rating.average ? serie.rating.average : "Sem nota";
  const generos = serie.genres.map(g => `<span class="tag">${g}</span>`).join("");
  const sinopse = limparHtml(serie.summary);
  const status = serie.status;

  area.innerHTML = `
    <div class="card">
      ${poster ? `<img src="${poster}" alt="${serie.name}">` : ""}
      <div class="card-info">
        <h2>${serie.name}</h2>
        <div class="tags">${generos}<span class="tag">${status}</span></div>
        <p class="nota">⭐ ${nota}</p>
        <p class="sinopse">${sinopse}</p>
      </div>
    </div>
  `;
}

botaoBuscar.addEventListener("click", () => {
  const termo = campoBusca.value.toLowerCase().trim();
  if (termo) {
    buscarSerie(termo);
  }
});

campoBusca.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    botaoBuscar.click();
  }
});
