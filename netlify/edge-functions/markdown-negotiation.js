const decodeEntities = (value) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const htmlToMarkdown = (html) => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;

  return decodeEntities(
    main
      .replace(/<!--([\s\S]*?)-->/g, "")
      .replace(/<(script|style|svg|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) =>
        `\n${"#".repeat(Number(level))} ${content}\n`,
      )
      .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
      .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
      .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
      .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n> $1\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|section|article|ul|ol|header)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
};

export default async function markdownNegotiation(request, context) {
  const accept = request.headers.get("accept") ?? "";
  if (request.method !== "GET" || !accept.toLowerCase().includes("text/markdown")) {
    return;
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.toLowerCase().includes("text/html")) {
    return response;
  }

  const markdown = `${htmlToMarkdown(await response.text())}\n`;
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/markdown; charset=utf-8");
  headers.set("vary", "Accept");
  headers.set("x-markdown-tokens", String(Math.ceil(markdown.length / 4)));
  headers.delete("content-length");
  headers.delete("content-encoding");

  return new Response(markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config = {
  path: "/",
  onError: "bypass",
};
