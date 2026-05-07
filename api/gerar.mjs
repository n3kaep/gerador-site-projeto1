export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { erro: "OPENROUTER_API_KEY não encontrada." },
        { status: 500 }
      );
    }

    const resposta = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: `
Você gera apenas HTML.

Regras:
- Responda somente com HTML completo.
- Comece com <!DOCTYPE html>.
- Use CSS dentro de <style>.
- Não use markdown.
- Não use crases.
- Não explique nada.
- Não use JavaScript.
- Faça uma página básica e simples.
- Máximo 100 linhas.
`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 900,
        temperature: 0.4
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      return Response.json(
        { erro: dados.error?.message || "Erro na OpenRouter." },
        { status: resposta.status }
      );
    }

    let resultado = dados.choices?.[0]?.message?.content || "";

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
    return Response.json(
      { erro: erro.message },
      { status: 500 }
    );
  }
}