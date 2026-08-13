import { createClient } from '@libsql/client/web';

// Configuración de credenciales de Turso DB
// Se pueden definir en .env.local o Vercel con VITE_TURSO_DATABASE_URL y VITE_TURSO_AUTH_TOKEN
const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL || '';
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || '';

let client = null;
let isInitialized = false;

export function getTursoClient() {
  if (client) return client;

  if (!TURSO_URL || !TURSO_TOKEN) {
    console.warn('⚠️ Turso DB: VITE_TURSO_DATABASE_URL o VITE_TURSO_AUTH_TOKEN no configuradas. Operando en modo almacenamiento local.');
    return null;
  }

  try {
    client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN
    });
    return client;
  } catch (err) {
    console.error('Error al conectar directamente con Turso DB:', err);
    return null;
  }
}

export async function initTursoTable() {
  if (isInitialized) return true;
  const db = getTursoClient();
  if (!db) return false;

  try {
    await db.execute(`
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
    isInitialized = true;
    return true;
  } catch (err) {
    console.error('Error al inicializar tabla en Turso DB:', err);
    return false;
  }
}

export async function saveSubmissionDirectly(payload) {
  const { studentName, grade, exerciseId, exerciseTitle, code, results, allPassed, passedCount, totalTests } = payload;

  // 1. Siempre guardar en localStorage para garantía total offline
  try {
    const existingStr = localStorage.getItem('pseint_exam_submissions');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift({
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString()
    });
    localStorage.setItem('pseint_exam_submissions', JSON.stringify(existing.slice(0, 200)));
  } catch (err) {
    console.warn('Error al guardar respaldo local:', err);
  }

  // 2. Guardar directamente a la base de datos Turso
  const db = getTursoClient();
  if (!db) return false;

  try {
    await initTursoTable();
    const resultsJson = typeof results === 'object' ? JSON.stringify(results) : (results || '[]');

    await db.execute({
      sql: `INSERT INTO submissions (student_name, grade, exercise_id, exercise_title, code, results, all_passed, passed_count, total_tests, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [
        studentName,
        grade,
        exerciseId,
        exerciseTitle || '',
        code,
        resultsJson,
        allPassed ? 1 : 0,
        passedCount || 0,
        totalTests || 0
      ]
    });
    console.log('✅ Entrega registrada directamente en Turso DB.');
    return true;
  } catch (err) {
    console.error('Error al guardar entrega directamente en Turso DB:', err);
    return false;
  }
}

export async function fetchSubmissionsDirectly(filterGrade = 'Todos') {
  const db = getTursoClient();

  if (!db) {
    // Si no hay conexión directa a Turso, cargar de localStorage
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (filterGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === filterGrade);
    }
    return localResults;
  }

  try {
    await initTursoTable();

    let query = 'SELECT * FROM submissions ORDER BY created_at DESC';
    let args = [];

    if (filterGrade && filterGrade !== 'Todos') {
      query = 'SELECT * FROM submissions WHERE grade = ? ORDER BY created_at DESC';
      args = [filterGrade];
    }

    const rs = await db.execute({ sql: query, args });

    const dbSubmissions = rs.rows.map(row => ({
      id: row.id,
      studentName: row.student_name,
      grade: row.grade,
      exerciseId: row.exercise_id,
      exerciseTitle: row.exercise_title,
      code: row.code,
      results: typeof row.results === 'string' ? JSON.parse(row.results) : row.results,
      allPassed: Boolean(row.all_passed),
      passedCount: Number(row.passed_count),
      totalTests: Number(row.total_tests),
      createdAt: row.created_at
    }));

    // Combinar con respaldo local para asegurar cero pérdidas
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (filterGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === filterGrade);
    }

    const merged = [...dbSubmissions];
    for (const loc of localResults) {
      if (!merged.some(m => m.studentName === loc.studentName && m.exerciseId === loc.exerciseId && m.createdAt === loc.createdAt)) {
        merged.push(loc);
      }
    }

    merged.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    return merged;
  } catch (err) {
    console.error('Error consultando Turso DB directamente:', err);
    // Fallback a localStorage
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (filterGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === filterGrade);
    }
    return localResults;
  }
}
