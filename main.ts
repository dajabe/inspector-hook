import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { exists } from "https://deno.land/std@0.181.0/fs/exists.ts";

const port = 8000;
const webhooksFile = "webhooks.json";

async function readWebhooks(): Promise<any[]> {
  if (await exists(webhooksFile)) {
    const content = await Deno.readTextFile(webhooksFile);
    return JSON.parse(content);
  }
  return [];
}

async function writeWebhook(webhook: any) {
  // const webhooks = await readWebhooks();
  const webhook_data = [{ timestamp: new Date().toISOString(), data: webhook }];
  await Deno.writeTextFile(
    webhooksFile,
    JSON.stringify(webhook_data, null, 2),
    {
      append: false,
    },
  );
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "POST") {
    const body = await request.json();
    console.log("Received webhook:", JSON.stringify(body, null, 2));
    await writeWebhook(body);
    return new Response("Webhook received and saved", { status: 200 });
  } else if (url.pathname === "/") {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webhook Inspector</title>
        <script>
          async function fetchWebhooks() {
            const response = await fetch('/webhooks');
            const webhooks = await response.json();
            const webhookList = document.getElementById('webhookList');
            webhookList.innerHTML = webhooks.map(webhook => 
              \`<li>
                <strong>\${webhook.timestamp}</strong>
                <pre>\${JSON.stringify(webhook.data, null, 2)}</pre>
              </li>\`
            ).join('');
          }
          setInterval(fetchWebhooks, 5000); // Refresh every 5 seconds
        </script>
      </head>
      <body onload="fetchWebhooks()">
        <h1>Received Webhooks</h1>
        <ul id="webhookList"></ul>
      </body>
      </html>
    `;
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } else if (url.pathname === "/webhooks") {
    const webhooks = await readWebhooks();
    return new Response(JSON.stringify(webhooks), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}

console.log(`Webhook listener starting on http://localhost:${port}`);
await serve(handleRequest, { port });

