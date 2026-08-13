import { getDbClient, initDb } from './db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { studentName, grade, exerciseId, exerciseTitle, code, results, allPassed, passedCount, totalTests } = req.body || {};

    if (!studentName || !grade || !exerciseId || !code) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (studentName, grade, exerciseId, code).' });
    }

    const client = getDbClient();
    if (!client) {
      // Return success in fallback mode so frontend local storage works smoothly
      return res.status(200).json({
        success: true,
        mode: 'local_fallback',
        message: 'Modo local sin base de datos Turso configurada.'
      });
    }

    await initDb();

    const resultsJson = typeof results === 'object' ? JSON.stringify(results) : (results || '[]');

    await client.execute({
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

    return res.status(200).json({ success: true, message: 'Respuesta guardada exitosamente en Turso DB.' });
  } catch (err) {
    console.error('Error al guardar respuesta:', err);
    return res.status(500).json({ error: 'Error interno del servidor al guardar respuesta.', details: err.message });
  }
}
