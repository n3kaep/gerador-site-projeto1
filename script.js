console.log("script carregado");

const textarea = document.getElementById("prompt");
const botao = document.getElementById("btnGerar");
const codigoGerado = document.getElementById("codigoGerado");
const previewSite = document.getElementById("previewSite");

botao.addEventListener("click", async () => {
  console.log("botão clicado");

  const prompt = textarea.value.trim();

  if (!prompt) {
    codigoGerado.textContent = "Digite algo.";
    return;
  }

  codigoGerado.textContent = "Gerando...";
  previewSite.srcdoc = "";

  try {
    const resposta = await fetch("/api/gerar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    console.log("status:", resposta.status);

    const dados = await resposta.json();

    console.log(dados);

    if (dados.erro) {
      codigoGerado.textContent = dados.erro;
      return;
    }

    codigoGerado.textContent = dados.resultado;
    previewSite.srcdoc = dados.resultado;

  } catch (erro) {
    console.log(erro);

    codigoGerado.textContent = "Erro ao conectar com API.";
  }
});