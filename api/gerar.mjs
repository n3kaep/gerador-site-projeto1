export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json(
        { erro: "Prompt vazio." },
        { status: 400 }
      );
    }

    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Crie apenas um código HTML simples baseado nesse pedido:
"${prompt}"

Regras:
- Retorne somente HTML.
- Não use markdown.
- Não use explicação.
- Não use JavaScript.
- Use CSS inline ou tag style.
- Faça algo visualmente bonito e simples.
`
                }
              ]
            }
          ]
        })
      }
    );

    const dados = await resposta.json();

    const texto =
      dados?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível gerar resposta.";

    return Response.json({ resultado: texto });
  } catch (erro) {
    return Response.json(
      { erro: "Erro interno ao gerar conteúdo." },
      { status: 500 }
    );
  }
}