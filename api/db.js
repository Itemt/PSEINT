import { createClient } from '@libsql/client';

let dbClient = null;

export function getDbClient() {
  if (dbClient) return dbClient;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.warn('TURSO_DATABASE_URL no está configurada. Operando en modo memoria/fallback.');
    return null;
  }

  dbClient = createClient({
    url: url,
    authToken: authToken || undefined
  });

  return dbClient;
}

export async function initDb() {
  const client = getDbClient();
  if (!client) return false;

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        grade TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        exercise_title TEXT NOT NULL,
        code TEXT NOT NULL,
        results TEXT NOT NULL,
        all_passed INTEGER NOT NULL,
        passed_count INTEGER NOT NULL,
        total_tests INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (err) {
    console.error('Error al inicializar tabla en Turso DB:', err);
    return false;
  }
}
