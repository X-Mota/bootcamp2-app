const SUPABASE_URL = "https://ajzpiaicemdmsvtzuzia.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqenBpYWljZW1kbXN2dHp1emlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMTAxNjgsImV4cCI6MjEwNzc4NjE2OH0.XEXIe7vd5gV0rWlm85whczjkB2l1KMgHW9zXGdDnnBQ";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaEl = document.getElementById("lista-favoritos");
const statusEl = document.getElementById("status-favoritos");

// O botão Favoritar é recriado a cada busca, então escuto o clique na área de resultado
area.addEventListener("click", (e) => {
  if (e.target.id === "btn-favoritar") favoritar(e.target);
});

// CREATE
async function favoritar(btn) {
  if (!serieAtual) return;
  btn.disabled = true;

  const { data: existe, error: erroBusca } = await db
    .from("favoritos").select("id").eq("nome_item", serieAtual.name).limit(1);

  if (erroBusca) {
    console.error(erroBusca);
    btn.textContent = "Erro ao salvar (veja o Console)";
    btn.disabled = false;
    return;
  }
  if (existe.length) {
    btn.textContent = "Já está nos favoritos";
    return;
  }

  const { error } = await db.from("favoritos").insert({
    nome_item: serieAtual.name,
    dados_extra: {
      tvmaze_id: serieAtual.id,
      imagem: serieAtual.image ? serieAtual.image.medium : null,
      nota: serieAtual.rating ? serieAtual.rating.average : null,
      status: serieAtual.status,
    },
  });

  if (error) {
    console.error(error);
    btn.textContent = "Erro ao salvar (veja o Console)";
    btn.disabled = false;
    return;
  }
  btn.textContent = "✅ Favoritado!";
  listarFavoritos();
}

// READ
async function listarFavoritos() {
  const { data, error } = await db
    .from("favoritos").select("*").order("criado_em", { ascending: false });

  if (error) {
    console.error(error);
    statusEl.textContent = "Erro ao carregar favoritos.";
    return;
  }

  statusEl.textContent = data.length ? "" : "Nenhum favorito ainda.";
  listaEl.innerHTML = "";

  data.forEach((f) => {
    const extra = f.dados_extra || {};
    const li = document.createElement("li");
    li.className = "fav-item";

    if (extra.imagem) {
      const img = document.createElement("img");
      img.src = extra.imagem;
      img.alt = f.nome_item;
      li.appendChild(img);
    }

    const info = document.createElement("span");
    info.textContent = f.nome_item + (extra.nota ? " · ⭐ " + extra.nota : "");
    li.appendChild(info);

    const del = document.createElement("button");
    del.className = "btn-del";
    del.textContent = "🗑️ Excluir";
    del.addEventListener("click", () => removerFavorito(f.id));
    li.appendChild(del);

    listaEl.appendChild(li);
  });
}

// DELETE
async function removerFavorito(id) {
  const { error } = await db.from("favoritos").delete().eq("id", id);
  if (error) console.error(error);
  listarFavoritos();
}

// Carrega a lista ao abrir a página
listarFavoritos();