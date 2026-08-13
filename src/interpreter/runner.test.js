import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

async function runCode(code, inputs = []) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();

  const outputLog = [];
  let inputIndex = 0;

  const interpreter = new Interpreter({
    onOutput: (text) => outputLog.push(text),
    onInputRequest: (varName) => {
      const val = inputs[inputIndex] !== undefined ? inputs[inputIndex] : '0';
      inputIndex++;
      return Promise.resolve(String(val));
    },
    onError: (err) => {
      throw new Error(err);
    }
  });

  await interpreter.execute(ast);
  return outputLog;
}

async function testAll() {
  console.log('=== INICIANDO PRUEBAS OBLIGATORIAS DEL INTÉRPRETE PSEINT ===\n');

  // Test 1: Variables y asignación
  const out1 = await runCode(`
    Proceso TestVariables
      Definir a Como Entero
      a <- 10
      Escribir a
    FinProceso
  `);
  console.log('Test 1 (Variables):', out1.join('') === '10' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out1})`);

  // Test 2: Suma
  const out2 = await runCode(`
    Proceso TestSuma
      Definir resultado Como Entero
      resultado <- 5 + 10
      Escribir resultado
    FinProceso
  `);
  console.log('Test 2 (Suma):', out2.join('') === '15' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out2})`);

  // Test 3: Resta
  const out3 = await runCode(`
    Proceso TestResta
      Definir resultado Como Entero
      resultado <- 20 - 8
      Escribir resultado
    FinProceso
  `);
  console.log('Test 3 (Resta):', out3.join('') === '12' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out3})`);

  // Test 4: Multiplicación
  const out4 = await runCode(`
    Proceso TestMult
      Definir resultado Como Entero
      resultado <- 5 * 4
      Escribir resultado
    FinProceso
  `);
  console.log('Test 4 (Multiplicación):', out4.join('') === '20' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out4})`);

  // Test 5: División
  const out5 = await runCode(`
    Proceso TestDiv
      Definir resultado Como Real
      resultado <- 20 / 4
      Escribir resultado
    FinProceso
  `);
  console.log('Test 5 (División):', out5.join('') === '5' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out5})`);

  // Test 6: Paréntesis
  const out6 = await runCode(`
    Proceso TestParen
      Definir resultado Como Entero
      resultado <- (5 + 5) * 2
      Escribir resultado
    FinProceso
  `);
  console.log('Test 6 (Paréntesis):', out6.join('') === '20' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out6})`);

  // Test 7: Leer
  const out7 = await runCode(`
    Proceso TestLeer
      Definir edad Como Entero
      Leer edad
      Escribir edad
    FinProceso
  `, [14]);
  console.log('Test 7 (Leer):', out7.join('') === '14' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out7})`);

  // Test 8: Si simple
  const out8 = await runCode(`
    Proceso TestSi
      Definir edad Como Entero
      edad <- 12
      Si edad >= 10 Entonces
        Escribir "Mayor"
      FinSi
    FinProceso
  `);
  console.log('Test 8 (Si):', out8.join('') === 'Mayor' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out8})`);

  // Test 9: Si/Sino
  const out9a = await runCode(`
    Proceso TestSiSino
      Definir nota Como Real
      nota <- 7
      Si nota >= 6 Entonces
        Escribir "Aprobado"
      Sino
        Escribir "Reprobado"
      FinSi
    FinProceso
  `);
  const out9b = await runCode(`
    Proceso TestSiSino2
      Definir nota Como Real
      nota <- 4
      Si nota >= 6 Entonces
        Escribir "Aprobado"
      Sino
        Escribir "Reprobado"
      FinSi
    FinProceso
  `);
  console.log('Test 9 (Si/Sino Aprobado):', out9a.join('') === 'Aprobado' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out9a})`);
  console.log('Test 9 (Si/Sino Reprobado):', out9b.join('') === 'Reprobado' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out9b})`);

  // Test 10: Y/O/NO
  const out10 = await runCode(`
    Proceso TestLogicos
      Definir edad Como Entero
      edad <- 12
      Si edad >= 10 Y edad <= 15 Entonces
        Escribir "Correcto"
      FinSi
    FinProceso
  `);
  console.log('Test 10 (Operadores Lógicos Y):', out10.join('') === 'Correcto' ? 'PASSED ✅' : `FAILED ❌ (Got: ${out10})`);

  // Test 11: PRUEBA OBLIGATORIA COMPRA DE MANZANAS (Req #15)
  const codeCompra = `
    Proceso Compra

      Definir kilos Como Entero
      Definir costo_total Como Entero
      Definir precio_final Como Entero

      Escribir "Ingrese los kilos de manzanas:"
      Leer kilos

      costo_total <- kilos * 4000

      Si costo_total > 20000 Entonces
        precio_final <- costo_total - 3000
      Sino
        precio_final <- costo_total
      FinSi

      Escribir "Precio final:", precio_final

    FinProceso
  `;

  const outCompra6 = await runCode(codeCompra, [6]);
  console.log('Test 11 (Compra 6 kilos -> 21000):', outCompra6.join(' ').includes('Precio final: 21000') ? 'PASSED ✅' : `FAILED ❌ (Got: ${outCompra6.join(' ')})`);

  const outCompra5 = await runCode(codeCompra, [5]);
  console.log('Test 11 (Compra 5 kilos -> 20000):', outCompra5.join(' ').includes('Precio final: 20000') ? 'PASSED ✅' : `FAILED ❌ (Got: ${outCompra5.join(' ')})`);

  // Test 12: Insensibilidad a Mayúsculas / Minúsculas
  const codeMinusculas = `
    algoritmo testminusculas
      definir horas, costototal, preciofinal como entero
      leer horas
      costototal = horas * 3000
      si costototal > 12000 entonces
        preciofinal = costototal - 2000
      sino
        preciofinal = costototal
      finsi
      escribir preciofinal
    finalgoritmo
  `;
  const outMinusculas = await runCode(codeMinusculas, [5]);
  console.log('Test 12 (Insensibilidad Mayúsculas/Minúsculas):', outMinusculas.join('').trim() === '13000' ? 'PASSED ✅' : `FAILED ❌ (Got: ${outMinusculas.join('')})`);

  // Test 13: Escribir sin coma entre texto y variable
  const codeSinComa = `
    Algoritmo TestSinComa
      Definir preciofinal Como Entero
      preciofinal <- 10000
      Escribir "El precio final es " preciofinal
    FinAlgoritmo
  `;
  const outSinComa = await runCode(codeSinComa);
  console.log('Test 13 (Escribir sin Comas Opcionales):', outSinComa.join(' ').includes('El precio final es  10000') ? 'PASSED ✅' : `FAILED ❌ (Got: ${outSinComa.join(' ')})`);

  console.log('\n=== PRUEBAS DE INTÉRPRETE FINALIZADAS ===');
}

testAll().catch(err => {
  console.error('ERROR EN PRUEBAS:', err);
  process.exit(1);
});
