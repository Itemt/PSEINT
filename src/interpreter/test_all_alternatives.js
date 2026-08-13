import { ALL_EXERCISES } from '../exercises/bank.js';
import { evaluateCodeAgainstExercise } from './evaluator.js';

async function runExhaustiveTestSuite() {
  console.log('================================================================');
  console.log('🧪 INICIANDO BATERÍA EXHAUSTIVA DE PRUEBAS PARA LOS 20 EJERCICIOS');
  console.log('   (Evaluando mayúsculas, minúsculas y combinaciones)');
  console.log('================================================================\n');

  let totalTestsExecuted = 0;
  let totalTestsPassed = 0;
  let totalTestsFailed = 0;

  for (let eIdx = 0; eIdx < ALL_EXERCISES.length; eIdx++) {
    const exercise = ALL_EXERCISES[eIdx];
    console.log(`📌 Ejercicio #${exercise.number}: "${exercise.title}" (${exercise.solutions.length} alternativas)`);

    for (let sIdx = 0; sIdx < exercise.solutions.length; sIdx++) {
      const originalSolution = exercise.solutions[sIdx];

      // Variations to test:
      const variations = [
        { name: 'Original', code: originalSolution },
        { name: 'Minúsculas (lowercase)', code: originalSolution.toLowerCase() },
        { name: 'Mayúsculas (UPPERCASE)', code: originalSolution.toUpperCase() }
      ];

      for (const varItem of variations) {
        totalTestsExecuted++;
        const res = await evaluateCodeAgainstExercise(varItem.code, exercise);

        if (res.success) {
          totalTestsPassed++;
          console.log(`   ✅ Alt #${sIdx + 1} [${varItem.name}]: PASÓ 100% (${res.passedCount}/${res.totalTests} casos de prueba)`);
        } else {
          totalTestsFailed++;
          console.log(`   ❌ Alt #${sIdx + 1} [${varItem.name}]: FALLÓ`);
          console.log(`      Detalle: ${res.error || res.details}`);
          if (res.results) {
            res.results.forEach(r => {
              if (!r.passed) {
                console.log(`      - Prueba #${r.testIndex} [${r.inputs.join(', ')}]: Esperaba "${r.expected}", Obtuvo: "${r.actual}"`);
              }
            });
          }
        }
      }
    }
    console.log('');
  }

  console.log('================================================================');
  console.log(`🏁 RESUMEN TOTAL DE EVALUACIÓN DE ALTERNATIVAS:`);
  console.log(`   Total Variaciones Evaluadas: ${totalTestsExecuted}`);
  console.log(`   Pruebas Pasadas Exitósamente: ${totalTestsPassed} ✅`);
  console.log(`   Pruebas Fallidas           : ${totalTestsFailed} ${totalTestsFailed === 0 ? '🎉' : '❌'}`);
  console.log('================================================================');

  if (totalTestsFailed > 0) {
    process.exit(1);
  }
}

runExhaustiveTestSuite().catch(err => {
  console.error('FATAL ERROR EN EVALUACIÓN:', err);
  process.exit(1);
});
