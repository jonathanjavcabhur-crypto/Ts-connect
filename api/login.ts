import type { IncomingMessage, ServerResponse } from "node:http";
import { loginUser } from "./_auth";
import { readJsonBody, sendJson } from "./_http";

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Método no permitido." });
  }
  try {
    const body = await readJsonBody(req);
    const result = await loginUser(body);
    return sendJson(res, result.status, result.body);
  } catch (err) {
    console.error("[v0] login error:", err);
    return sendJson(res, 500, { error: "Error del servidor. Inténtalo de nuevo." });
  }
}
