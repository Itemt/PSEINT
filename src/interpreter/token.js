export const TokenType = {
  // Keywords
  ALGORITMO: 'ALGORITMO',
  FINALGORITMO: 'FINALGORITMO',
  PROCESO: 'PROCESO',
  FINPROCESO: 'FINPROCESO',
  DEFINIR: 'DEFINIR',
  COMO: 'COMO',
  ENTERO: 'ENTERO',
  REAL: 'REAL',
  CARACTER: 'CARACTER',
  CADENA: 'CADENA',
  TEXTO: 'TEXTO',
  LOGICO: 'LOGICO',
  LEER: 'LEER',
  ESCRIBIR: 'ESCRIBIR',
  SI: 'SI',
  ENTONCES: 'ENTONCES',
  SINO: 'SINO',
  FINSI: 'FINSI',

  // Logical operators keywords
  AND: 'Y',
  OR: 'O',
  NOT: 'NO',

  // Boolean Literals
  VERDADERO: 'VERDADERO',
  FALSO: 'FALSO',

  // Identifiers & Literals
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',

  // Operators
  ASSIGN: '<-',
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  POWER: '^',
  EQUAL: '=',
  NOT_EQUAL: '<>',
  LESS: '<',
  LESS_EQUAL: '<=',
  GREATER: '>',
  GREATER_EQUAL: '>=',

  // Punctuation
  COMMA: ',',
  LPAREN: '(',
  RPAREN: ')',
  COLON: ':',
  SEMICOLON: ';',

  // End of File / Line
  EOF: 'EOF',
  NEWLINE: 'NEWLINE'
};

export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, "${this.value}", L${this.line}:C${this.column})`;
  }
}
