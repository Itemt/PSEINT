import { getDbClient, initDb } from './db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido. Usa GET.' });
  }

  try {
    const { grade } = req.query || {};
    const client = getDbClient();

    if (!client) {
      return res.status(200).json({
        success: true,
        mode: 'local_fallback',
        submissions: []
      });
    }

    await initDb();

    let query = 'SELECT * FROM submissions ORDER BY created_at DESC';
    let args = [];

    if (grade && grade !== 'Todos') {
      query = 'SELECT * FROM submissions WHERE grade = ? ORDER BY created_at DESC';
      args = [grade];
    }

    const rs = await client.execute({ sql: query, args });

    const submissions = rs.rows.map(row => ({
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

    return res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (err) {
    console.error('Error al consultar respuestas:', err);
    return res.status(500).json({ error: 'Error interno del servidor al consultar respuestas.', details: err.message });
  }
}
