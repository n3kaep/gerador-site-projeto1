console.log("script carregado");

const textarea = document.getElementById("prompt");
const botao = document.getElementById("btnGerar");
const codigoGerado = document.getElementById("codigoGerado");
const previewSite = document.getElementById("previewSite");

botao.addEventListener("click", async () => {
  const prompt = textarea.value.trim();

  if (!prompt) {
    codigoGerado.textContent = "Digite uma ideia primeiro.";
    return;
  }

  botao.textContent = "Gerando...";
  botao.disabled = true;
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

    const dados = await resposta.json();

    console.log(dados);

    if (!resposta.ok || dados.erro) {
      codigoGerado.textContent = dados.erro || "Erro ao gerar.";
      return;
    }

    if (!dados.resultado || dados.resultado.trim() === "") {
      codigoGerado.textContent = "A IA respondeu vazio.";
      return;
    }

    codigoGerado.textContent = dados.resultado;
    previewSite.srcdoc = dados.resultado;

  } catch (erro) {
    console.log(erro);
    codigoGerado.textContent = "Erro de conexão com /api/gerar.";
  } finally {
    botao.textContent = "Gerar";
    botao.disabled = false;
  }
});