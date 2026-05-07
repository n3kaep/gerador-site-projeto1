export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { erro: "GEMINI_API_KEY não encontrada no servidor." },
        { status: 500 }
      );
    }

    const resposta = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
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
                  text: `Crie somente HTML com CSS inline. Pedido: ${prompt}`
                }
              ]
            }
          ]
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      return Response.json(
        {
          erro: dados.error?.message || "Erro na API da Gemini.",
          detalhes: dados
        },
        { status: resposta.status }
      );
    }

    const resultado = dados.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultado) {
      return Response.json(
        {
          erro: "A Gemini respondeu, mas sem texto.",
          detalhes: dados
        },
        { status: 500 }
      );
    }

    return Response.json({ resultado });

  } catch (erro) {
    return Response.json(
      { erro: erro.message },
      { status: 500 }
    );
  }
}