import { neon } from "@neondatabase/serverless";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

const sql = neon(connectionString);

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResult {
  status: number;
  body: { user?: PublicUser; error?: string };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== derived.length) return false;
  return timingSafeEqual(keyBuffer, derived);
}

export async function registerUser(input: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}): Promise<AuthResult> {
  if (!connectionString) {
    return { status: 500, body: { error: "La base de datos no está configurada." } };
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!name || !email || !password) {
    return { status: 400, body: { error: "Completa todos los campos." } };
  }
  if (name.length < 2) {
    return { status: 400, body: { error: "El nombre es demasiado corto." } };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { status: 400, body: { error: "Introduce un correo válido." } };
  }
  if (password.length < 6) {
    return {
      status: 400,
      body: { error: "La contraseña debe tener al menos 6 caracteres." },
    };
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0) {
    return { status: 409, body: { error: "Ese correo ya está registrado." } };
  }

  const passwordHash = hashPassword(password);

  const rows = await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING id, name, email, created_at
  `;

  const row = rows[0];
  return {
    status: 201,
    body: {
      user: {
        id: String(row.id),
        name: row.name,
        email: row.email,
        createdAt: row.created_at,
      },
    },
  };
}

export async function loginUser(input: {
  email?: unknown;
  password?: unknown;
}): Promise<AuthResult> {
  if (!connectionString) {
    return { status: 500, body: { error: "La base de datos no está configurada." } };
  }

  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!email || !password) {
    return { status: 400, body: { error: "Introduce tu correo y contraseña." } };
  }

  const rows = await sql`
    SELECT id, name, email, password_hash, created_at
    FROM users WHERE email = ${email} LIMIT 1
  `;

  const row = rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) {
    return { status: 401, body: { error: "Correo o contraseña incorrectos." } };
  }

  return {
    status: 200,
    body: {
      user: {
        id: String(row.id),
        name: row.name,
        email: row.email,
        createdAt: row.created_at,
      },
    },
  };
}
