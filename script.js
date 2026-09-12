async function buscarDados(termo) {
    const area = document.getElementById("resultado");
    area.innerHTML = "<p>Carregando...</p>";
  
    try {
        // A API REST Countries busca pelo nome do país
        const resposta = await fetch(`https://restcountries.com/v3.1/name/${termo}`);
      
        if (!resposta.ok) {
            throw new Error("País não encontrado");
        }
      
        const dados = await resposta.json();
        const pais = dados[0]; // A API retorna um array, pegamos o primeiro resultado
      
        // Extraindo mínimo de 3 informações: Nome, Bandeira, Capital, População e Continente
        area.innerHTML = `
            <div class="card-pais">
                <h2>${pais.name.common}</h2>
                <img src="${pais.flags.svg}" alt="Bandeira de ${pais.name.common}">
                <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : 'Não possui'}</p>
                <p><strong>População:</strong> ${pais.population.toLocaleString('pt-BR')}</p>
                <p><strong>Continente:</strong> ${pais.region}</p>
            </div>
        `;
    } catch (erro) {
        area.innerHTML = `<p class="erro">Ops! Não encontramos nenhum país com o termo "${termo}". Tente digitar em inglês (ex: Germany).</p>`;
    }
}
  
document.getElementById("botao-buscar").addEventListener("click", () => {
    const termo = document.getElementById("campo-busca").value.trim();
    if (termo) buscarDados(termo);
});

// Permite buscar apertando "Enter"
document.getElementById("campo-busca").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const termo = e.target.value.trim();
        if (termo) buscarDados(termo);
    }
});