import type { IncomingMessage, ServerResponse } from "node:http";

export function sendJson(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(payload);
}

export async function readJsonBody(
  req: IncomingMessage & { body?: unknown },
): Promise<Record<string, unknown>> {
  // Vercel may have already parsed the body.
  if (req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === "string" && req.body.length > 0) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  const raw = await new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
