export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthResponse {
  user?: AuthUser;
  error?: string;
}

async function postAuth(
  path: string,
  payload: Record<string, string>,
): Promise<AuthUser> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  let data: AuthResponse = {};
  try {
    data = (await res.json()) as AuthResponse;
  } catch {
    // ignore malformed JSON
  }

  if (!res.ok || !data.user) {
    throw new Error(data.error || "Algo salió mal. Inténtalo de nuevo.");
  }

  return data.user;
}

export function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  return postAuth("/api/register", input);
}

export function loginAccount(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  return postAuth("/api/login", input);
}
