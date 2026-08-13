import { createClient } from '@libsql/client/web';

// Credenciales directas de la base de datos Turso de la cuenta de Itemt
const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL || "libsql://movers-exam-itemt.aws-us-east-1.turso.io";
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODYzNzU3MDIsImlkIjoiMDE5ZmVjNDgtYzEwMS03YTJkLWJmOTYtOTVlMDk4NWY4ODg0Iiwia2lkIjoidkNadHFCTjZpbnF5dFZiS0F1NW5ndnlTdUZjS3ZzMElFYjJJeHRZTXNFVSIsInJpZCI6ImUyNmNhMTMzLTI1ZGMtNDdjZS1hMGRmLTMwMTFiZDhhYWNlYSJ9.jIL2vxUGccRbkTTDnavQTZ4E-pgocobXFWYssyuHqC3ImjuumB80T4rrxqw5il31ezMTRrXDwcbr7WUN_CeqDg";

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
      CREATE TABLE IF NOT EXISTS pseint_submissions (
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
    console.error('Error al inicializar tabla pseint_submissions en Turso DB:', err);
    return false;
  }
}

export function formatUTC5Date(dateString) {
  if (!dateString) return 'Reciente';
  try {
    let formattedStr = String(dateString).trim();
    // Convert SQLite standard format YYYY-MM-DD HH:MM:SS to ISO UTC format YYYY-MM-DDTHH:MM:SSZ
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(formattedStr)) {
      formattedStr = formattedStr.replace(' ', 'T') + 'Z';
    }
    const date = new Date(formattedStr);
    if (isNaN(date.getTime())) return String(dateString);

    return new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota', // UTC-5 (Colombia)
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  } catch (err) {
    return String(dateString);
  }
}

export async function saveSubmissionDirectly(payload) {
  const { studentName, grade, exerciseId, exerciseTitle, code, results, allPassed, passedCount, totalTests } = payload;

  // 1. Guardar en localStorage para respaldo offline
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

  // 2. Guardar directamente a la base de datos Turso (movers-exam-itemt)
  const db = getTursoClient();
  if (!db) return false;

  try {
    await initTursoTable();
    const resultsJson = typeof results === 'object' ? JSON.stringify(results) : (results || '[]');

    await db.execute({
      sql: `INSERT INTO pseint_submissions (student_name, grade, exercise_id, exercise_title, code, results, all_passed, passed_count, total_tests, created_at)
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
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (filterGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === filterGrade);
    }
    return localResults;
  }

  try {
    await initTursoTable();

    let query = 'SELECT * FROM pseint_submissions ORDER BY created_at DESC';
    let args = [];

    if (filterGrade && filterGrade !== 'Todos') {
      query = 'SELECT * FROM pseint_submissions WHERE grade = ? ORDER BY created_at DESC';
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

    // Combinar con respaldo local para asegurar 0 pérdidas
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (filterGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === filterGrade);
    }

    const merged = [...dbSubmissions];
    for (const loc of localResults) {
      if (!merged.some(m => (m.id && m.id === loc.id) || (m.studentName === loc.studentName && m.exerciseId === loc.exerciseId && m.createdAt === loc.createdAt))) {
        merged.push(loc);
      }
    }

    merged.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    return merged;
  } catch (err) {
    console.error('Error consultando Turso DB directamente:', err);
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (filterGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === filterGrade);
    }
    return localResults;
  }
}

export async function deleteSubmissionDirectly(id, studentName, exerciseId) {
  // 1. Eliminar de LocalStorage
  try {
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    if (localDataStr) {
      let localResults = JSON.parse(localDataStr);
      localResults = localResults.filter(item => {
        if (id && item.id === id) return false;
        if (studentName && exerciseId && item.studentName === studentName && item.exerciseId === exerciseId) return false;
        return true;
      });
      localStorage.setItem('pseint_exam_submissions', JSON.stringify(localResults));
    }
  } catch (err) {
    console.warn('Error al borrar de localStorage:', err);
  }

  // 2. Eliminar de Turso DB
  const db = getTursoClient();
  if (!db) return true;

  try {
    await initTursoTable();
    if (id) {
      await db.execute({
        sql: `DELETE FROM pseint_submissions WHERE id = ?`,
        args: [id]
      });
    } else if (studentName && exerciseId) {
      await db.execute({
        sql: `DELETE FROM pseint_submissions WHERE student_name = ? AND exercise_id = ?`,
        args: [studentName, exerciseId]
      });
    }
    console.log('🗑️ Entrega eliminada de Turso DB.');
    return true;
  } catch (err) {
    console.error('Error al borrar entrega de Turso DB:', err);
    return false;
  }
}

export async function deleteStudentSubmissionsDirectly(studentName) {
  // 1. Eliminar de LocalStorage
  try {
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    if (localDataStr) {
      let localResults = JSON.parse(localDataStr);
      localResults = localResults.filter(item => item.studentName !== studentName);
      localStorage.setItem('pseint_exam_submissions', JSON.stringify(localResults));
    }
  } catch (err) {
    console.warn('Error al borrar estudiante de localStorage:', err);
  }

  // 2. Eliminar de Turso DB
  const db = getTursoClient();
  if (!db) return true;

  try {
    await initTursoTable();
    await db.execute({
      sql: `DELETE FROM pseint_submissions WHERE student_name = ?`,
      args: [studentName]
    });
    console.log(`🗑️ Todas las entregas de ${studentName} fueron eliminadas de Turso DB.`);
    return true;
  } catch (err) {
    console.error(`Error al borrar entregas de ${studentName} en Turso DB:`, err);
    return false;
  }
}
