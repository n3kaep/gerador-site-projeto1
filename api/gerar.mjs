export async function POST(request) {
  try {
    const { prompt } = await request.json();

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
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const dados = await resposta.json();

    console.log(dados);

    if (!resposta.ok) {
      return Response.json({
        erro: dados.error?.message || "Erro Gemini"
      });
    }

    return Response.json({
      resultado:
        dados.candidates?.[0]?.content?.parts?.[0]?.text
    });

  } catch (erro) {
    return Response.json({
      erro: erro.message
    });
  }
}