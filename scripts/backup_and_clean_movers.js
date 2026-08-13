import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const MOVERS_URL = "https://movers-exam-itemt.aws-us-east-1.turso.io";
const MOVERS_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODYzNzU3MDIsImlkIjoiMDE5ZmVjNDgtYzEwMS03YTJkLWJmOTYtOTVlMDk4NWY4ODg0Iiwia2lkIjoidkNadHFCTjZpbnF5dFZiS0F1NW5ndnlTdUZjS3ZzMElFYjJJeHRZTXNFVSIsInJpZCI6ImUyNmNhMTMzLTI1ZGMtNDdjZS1hMGRmLTMwMTFiZDhhYWNlYSJ9.jIL2vxUGccRbkTTDnavQTZ4E-pgocobXFWYssyuHqC3ImjuumB80T4rrxqw5il31ezMTRrXDwcbr7WUN_CeqDg";

async function backupAndCleanMovers() {
  console.log('🚀 Conectando a Turso DB (movers-exam-itemt) para realizar Backup...');
  const client = createClient({
    url: MOVERS_URL,
    authToken: MOVERS_TOKEN
  });

  const backupData = {
    timestamp: new Date().toISOString(),
    database: 'movers-exam-itemt',
    pseint_submissions: [],
    pseint_students: []
  };

  // 1. Respaldar pseint_submissions
  try {
    const rsSub = await client.execute('SELECT * FROM pseint_submissions');
    backupData.pseint_submissions = rsSub.rows;
    console.log(`📦 Respaldadas ${rsSub.rows.length} entregas de pseint_submissions.`);
  } catch (err) {
    console.warn('⚠️ No se encontró la tabla pseint_submissions o está vacía:', err.message);
  }

  // 2. Respaldar pseint_students
  try {
    const rsStud = await client.execute('SELECT * FROM pseint_students');
    backupData.pseint_students = rsStud.rows;
    console.log(`📦 Respaldados ${rsStud.rows.length} estudiantes de pseint_students.`);
  } catch (err) {
    console.warn('⚠️ No se encontró la tabla pseint_students o está vacía:', err.message);
  }

  // Guardar archivo JSON de respaldo local y en iCloud
  const backupFileName = `backup_movers_pseint_${Date.now()}.json`;
  const backupPath = path.join(process.cwd(), 'scripts', backupFileName);
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`✅ Backup guardado exitosamente en: ${backupPath}`);

  // 3. Eliminar tablas de PSeInt en movers-exam-itemt
  console.log('🧹 Eliminando las tablas de PSeInt en la DB de Movers para dejarla 100% limpia...');
  await client.execute('DROP TABLE IF EXISTS pseint_submissions');
  await client.execute('DROP TABLE IF EXISTS pseint_students');
  console.log('🎉 ¡Limpieza completada! La DB de Movers ha quedado sin tablas ni datos de PSeInt.');
}

backupAndCleanMovers().catch(err => {
  console.error('❌ Error realizando backup y limpieza en Movers DB:', err);
  process.exit(1);
});
