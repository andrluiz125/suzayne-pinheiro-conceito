import assert from "node:assert/strict";
import test from "node:test";

const productionDescription =
  /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']Compare planos de saúde em São Paulo[^"']*["'])[^>]*>/i;
const productionCanonical =
  /<link(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/suzayne-pinheiro-conceito\.vercel\.app\/["'])[^>]*>/i;

test("renders production SEO metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Suzayne Pinheiro \| Plano de Saúde em São Paulo<\/title>/i);
  assert.match(html, productionDescription);
  assert.match(html, productionCanonical);
});
