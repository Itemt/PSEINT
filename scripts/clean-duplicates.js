import { createClient } from '@libsql/client';

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL || "https://movers-exam-itemt.aws-us-east-1.turso.io";
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODYzNzU3MDIsImlkIjoiMDE5ZmVjNDgtYzEwMS03YTJkLWJmOTYtOTVlMDk4NWY4ODg0Iiwia2lkIjoidkNadHFCTjZpbnF5dFZiS0F1NW5ndnlTdUZjS3ZzMElFYjJJeHRZTXNFVSIsInJpZCI6ImUyNmNhMTMzLTI1ZGMtNDdjZS1hMGRmLTMwMTFiZDhhYWNlYSJ9.jIL2vxUGccRbkTTDnavQTZ4E-pgocobXFWYssyuHqC3ImjuumB80T4rrxqw5il31ezMTRrXDwcbr7WUN_CeqDg";

async function cleanDuplicates() {
  console.log('🧹 Limpiando duplicados en la base de datos Turso DB...');
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN
  });

  // Keep only the latest entry per (student_name, exercise_id)
  await client.execute(`
    DELETE FROM pseint_submissions
    WHERE id NOT IN (
      SELECT MAX(id)
      FROM pseint_submissions
      GROUP BY student_name, exercise_id
    )
  `);

  console.log('🎉 ¡Duplicados eliminados exitosamente de Turso DB!');
}

cleanDuplicates().catch(err => {
  console.error('Error al limpiar duplicados:', err);
});
