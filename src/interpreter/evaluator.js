import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

export async function evaluateCodeAgainstExercise(code, exercise) {
  if (!exercise || !exercise.testCases) {
    return { success: true, message: 'No hay casos de prueba definidos.' };
  }

  // Check if code has unindented lines inside blocks to offer a friendly tip
  const lines = code.split('\n');
  let hasUnindentedBlock = false;
  let inBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('algoritmo') || trimmed.toLowerCase().startsWith('proceso') || trimmed.toLowerCase().startsWith('si ')) {
      inBlock = true;
      continue;
    }
    if (trimmed.toLowerCase().startsWith('finalgoritmo') || trimmed.toLowerCase().startsWith('finproceso') || trimmed.toLowerCase().startsWith('finsi')) {
      inBlock = false;
      continue;
    }
    if (inBlock && trimmed.length > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
      hasUnindentedBlock = true;
    }
  }

  // 1. Check syntax first (Lexer & Parser ignore indentation spaces)
  let ast;
  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    ast = parser.parse();
  } catch (err) {
    return {
      success: false,
      type: 'SYNTAX_ERROR',
      error: err.message || String(err),
      details: 'Sugerencia: Revisa la sintaxis de tu código. Asegúrate de cerrar la estructura "Algoritmo ... FinAlgoritmo" y los condicionales "Si ... Entonces ... FinSi".'
    };
  }

  // 2. Evaluate all test cases
  const results = [];
  let passedCount = 0;

  for (let i = 0; i < exercise.testCases.length; i++) {
    const testCase = exercise.testCases[i];
    const inputs = [...(testCase.inputs || [])];
    let inputIdx = 0;
    const outputLog = [];

    try {
      const interpreter = new Interpreter({
        onOutput: (text) => outputLog.push(text),
        onInputRequest: () => {
          const val = inputs[inputIdx] !== undefined ? inputs[inputIdx] : '0';
          inputIdx++;
          return Promise.resolve(String(val));
        },
        onError: (err) => {
          throw new Error(err);
        }
      });

      await interpreter.execute(ast);

      const fullOutput = outputLog.join(' ');

      // Accept single expected string or array of acceptable expected outputs
      let isPassed = false;
      if (Array.isArray(testCase.expected)) {
        isPassed = testCase.expected.some(exp => 
          fullOutput.toLowerCase().includes(String(exp).toLowerCase())
        );
      } else {
        isPassed = fullOutput.toLowerCase().includes(String(testCase.expected).toLowerCase());
      }

      if (isPassed) {
        passedCount++;
      }

      results.push({
        testIndex: i + 1,
        description: testCase.description || `Prueba con entrada [${testCase.inputs.join(', ')}]`,
        inputs: testCase.inputs,
        expected: Array.isArray(testCase.expected) ? testCase.expected.join(' o ') : testCase.expected,
        actual: fullOutput.trim() || '(Sin salida)',
        passed: isPassed
      });
    } catch (runtimeErr) {
      results.push({
        testIndex: i + 1,
        description: testCase.description || `Prueba con entrada [${testCase.inputs.join(', ')}]`,
        inputs: testCase.inputs,
        expected: testCase.expected,
        actual: `Error: ${runtimeErr.message}`,
        passed: false
      });
    }
  }

  const allPassed = passedCount === exercise.testCases.length;

  // Build suggestion
  let suggestion = '';
  if (!allPassed) {
    if (exercise.operatorUsed && exercise.conditionalUsed) {
      suggestion = `💡 Sugerencia: Revisa tus operaciones matemáticas (Operador '${exercise.operatorUsed}') y la condición de tu condicional ('${exercise.conditionalUsed}').`;
    } else {
      suggestion = '💡 Sugerencia: Revisa los valores ingresados en Leer y los resultados mostrados con Escribir.';
    }
  } else if (hasUnindentedBlock) {
    suggestion = '💡 Recomendación de Estilo: Puedes presionar la tecla Tab para indentar el código dentro de los bloques Si o Algoritmo. ¡Hará tu código más limpio y fácil de leer!';
  }

  return {
    success: allPassed,
    passedCount: passedCount,
    totalTests: exercise.testCases.length,
    message: allPassed
      ? `✅ ¡Excelente! Tu algoritmo superó el 100% de los casos de prueba (${passedCount}/${exercise.testCases.length}).`
      : `⚠️ Se completaron ${passedCount} de ${exercise.testCases.length} casos de prueba correctamente.`,
    error: !allPassed ? 'Algunas pruebas no produjeron el resultado esperado.' : null,
    details: suggestion,
    results: results
  };
}
