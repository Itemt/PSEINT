import { createClient } from '@libsql/client';
import { STUDENTS_6A, STUDENTS_6B } from '../src/models/Student.js';

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL || "libsql://movers-exam-itemt.aws-us-east-1.turso.io";
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODYzNzU3MDIsImlkIjoiMDE5ZmVjNDgtYzEwMS03YTJkLWJmOTYtOTVlMDk4NWY4ODg0Iiwia2lkIjoidkNadHFCTjZpbnF5dFZiS0F1NW5ndnlTdUZjS3ZzMElFYjJJeHRZTXNFVSIsInJpZCI6ImUyNmNhMTMzLTI1ZGMtNDdjZS1hMGRmLTMwMTFiZDhhYWNlYSJ9.jIL2vxUGccRbkTTDnavQTZ4E-pgocobXFWYssyuHqC3ImjuumB80T4rrxqw5il31ezMTRrXDwcbr7WUN_CeqDg";

async function seed() {
  console.log('🚀 Conectando a Turso Database (movers-exam-itemt)...');
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN
  });

  console.log('📦 Inicializando tablas en Turso...');
  await client.execute(`
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

  await client.execute(`
    CREATE TABLE IF NOT EXISTS pseint_students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      grade TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('🌱 Sembrando estudiantes de Grado 6°A y Grado 6°B en Turso...');
  let count = 0;

  for (const name of STUDENTS_6A) {
    try {
      await client.execute({
        sql: `INSERT INTO pseint_students (name, grade) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET grade=excluded.grade`,
        args: [name, '6A']
      });
      count++;
    } catch (e) {
      console.warn(`⚠️ Warning al insertar ${name}:`, e.message);
    }
  }

  for (const name of STUDENTS_6B) {
    try {
      await client.execute({
        sql: `INSERT INTO pseint_students (name, grade) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET grade=excluded.grade`,
        args: [name, '6B']
      });
      count++;
    } catch (e) {
      console.warn(`⚠️ Warning al insertar ${name}:`, e.message);
    }
  }

  console.log(`🎉 ¡Éxito! Base de datos inicializada y ${count} estudiantes sembrados correctamente en Turso DB.`);
}

seed().catch(err => {
  console.error('❌ Error durante la siembra en Turso:', err);
  process.exit(1);
});
