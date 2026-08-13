import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const NEW_TURSO_URL = "https://pseint-exam-itemt.aws-us-east-1.turso.io";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODY2MzYyNTEsImlkIjoiMDE5ZmZiY2UtYjcwMS03OWVjLWJkNTktNjdiM2E2NTQ0ZTIwIiwia2lkIjoidkNadHFCTjZpbnF5dFZiS0F1NW5ndnlTdUZjS3ZzMElFYjJJeHRZTXNFVSIsInJpZCI6ImY5OTkyNWQ4LTk5NmQtNDY5NC1iOTc3LTVhNWQ1OGQ0N2MwZCJ9.zQIgN-SBLvxEcyvkha3DfCCexPZIye2-0U3wqZWwEj7OC_c3ZzB2S-_LR28ZsaIQDHg0djF6FDF4vMIicONIDw";

async function restoreToNewDb() {
  console.log('🚀 Conectando a la nueva base de datos Turso (pseint-exam-itemt)...');
  const client = createClient({
    url: NEW_TURSO_URL,
    authToken: TURSO_TOKEN
  });

  console.log('📦 Inicializando tablas pseint_submissions y pseint_students en pseint-exam-itemt...');
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

  // Restaurar datos del último backup
  const backupFiles = fs.readdirSync(path.join(process.cwd(), 'scripts')).filter(f => f.startsWith('backup_movers_pseint_'));
  backupFiles.sort().reverse();

  if (backupFiles.length > 0) {
    const latestBackup = path.join(process.cwd(), 'scripts', backupFiles[0]);
    console.log(`📥 Restaurando datos desde backup: ${latestBackup}`);
    const backupContent = JSON.parse(fs.readFileSync(latestBackup, 'utf8'));

    // Restaurar estudiantes
    let studCount = 0;
    for (const st of backupContent.pseint_students || []) {
      try {
        await client.execute({
          sql: `INSERT INTO pseint_students (name, grade) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET grade=excluded.grade`,
          args: [st.name, st.grade]
        });
        studCount++;
      } catch (e) {
        console.warn(`Warning estudiantes: ${e.message}`);
      }
    }

    // Restaurar entregas
    let subCount = 0;
    for (const sub of backupContent.pseint_submissions || []) {
      try {
        await client.execute({
          sql: `INSERT INTO pseint_submissions (student_name, grade, exercise_id, exercise_title, code, results, all_passed, passed_count, total_tests, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            sub.student_name,
            sub.grade,
            sub.exercise_id,
            sub.exercise_title,
            sub.code,
            typeof sub.results === 'object' ? JSON.stringify(sub.results) : sub.results,
            sub.all_passed,
            sub.passed_count,
            sub.total_tests,
            sub.created_at
          ]
        });
        subCount++;
      } catch (e) {
        console.warn(`Warning entregas: ${e.message}`);
      }
    }

    console.log(`🎉 ¡MIGRACIÓN A PSEINT-EXAM-ITEMT COMPLETADA CON ÉXITO!`);
    console.log(`   Estudiantes restaurados: ${studCount}`);
    console.log(`   Entregas restauradas: ${subCount}`);
  }
}

restoreToNewDb().catch(err => {
  console.error('❌ Error al conectar/restaurar en la nueva DB:', err);
  process.exit(1);
});
