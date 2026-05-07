export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        {
          erro: "OPENROUTER_API_KEY não encontrada."
        },
        {
          status: 500
        }
      );
    }

    const resposta = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          models: [
            "qwen/qwen-2.5-coder-32b-instruct:free",
            "deepseek/deepseek-chat-v3.1:free",
            "meta-llama/llama-3.1-8b-instruct:free"
          ],

          messages: [
            {
              role: "system",
              content: `
Você é um gerador de sites.

Regras:
- Retorne somente HTML.
- Comece com <!DOCTYPE html>.
- Não use markdown.
- Não use crases.
- Não explique nada.
- Use CSS dentro de <style>.
- Não use JavaScript.
- Crie um design moderno.
- Faça algo responsivo.
- Máximo 120 linhas.
`
            },

            {
              role: "user",
              content: prompt
            }
          ],

          max_tokens: 1200,
          temperature: 0.5
        })
      }
    );

    const dados = await resposta.json();

    console.log(dados);

    if (!resposta.ok) {
      return Response.json(
        {
          erro: dados.error?.message || "Erro OpenRouter."
        },
        {
          status: resposta.status
        }
      );
    }

    let resultado =
      dados.choices?.[0]?.message?.content || "";

    resultado = resultado
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    const inicioHtml =
      resultado.indexOf("<!DOCTYPE html>");

    if (inicioHtml !== -1) {
      resultado = resultado.slice(inicioHtml);
    }

    return Response.json({
      resultado
    });

  } catch (erro) {
    console.log(erro);

    return Response.json(
      {
        erro: erro.message
      },
      {
        status: 500
      }
    );
  }
}