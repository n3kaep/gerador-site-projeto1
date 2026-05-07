export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
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
Você é um gerador de HTML.

Pedido do usuário: ${prompt}

Responda somente com o código HTML completo.
Não escreva explicações.
Não use markdown.
Não use crases.
Não use \`\`\`html.
Comece exatamente com <!DOCTYPE html>.
Use CSS dentro de <style>.
Não use JavaScript.
Máximo 100 linhas.
`
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 900,
            temperature: 0.3
          }
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      return Response.json({
        erro: dados.error?.message || "Erro Gemini"
      });
    }

    let resultado = dados.candidates?.[0]?.content?.parts?.[0]?.text || "";

    resultado = resultado
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    const inicioHtml = resultado.indexOf("<!DOCTYPE html>");

    if (inicioHtml !== -1) {
      resultado = resultado.slice(inicioHtml);
    }

    return Response.json({ resultado });

  } catch (erro) {
    return Response.json({
      erro: erro.message
    });
  }
}