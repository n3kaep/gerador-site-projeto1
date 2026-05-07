const textarea = document.getElementById("prompt");
const botao = document.getElementById("btnGerar");
const codigoGerado = document.getElementById("codigoGerado");
const previewSite = document.getElementById("previewSite");

botao.addEventListener("click", async () => {
  const texto = textarea.value.trim();

  if (!texto) {
    codigoGerado.textContent = "Digite alguma coisa primeiro.";
    return;
  }

  botao.textContent = "Criando...";
  botao.disabled = true;
  codigoGerado.textContent = "";
  previewSite.innerHTML = "";

  try {
    const resposta = await fetch("/api/gerar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: texto })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      codigoGerado.textContent = dados.erro || "Erro ao gerar.";
      return;
    }

    codigoGerado.textContent = dados.resultado;
    previewSite.innerHTML = dados.resultado;
  } catch (erro) {
    codigoGerado.textContent = "Erro de conexão.";
  } finally {
    botao.textContent = "Criar";
    botao.disabled = false;
  }
});