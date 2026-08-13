import { TokenType, Token } from './token.js';

const KEYWORDS = {
  'ALGORITMO': TokenType.ALGORITMO,
  'FINALGORITMO': TokenType.FINALGORITMO,
  'PROCESO': TokenType.PROCESO,
  'FINPROCESO': TokenType.FINPROCESO,
  'DEFINIR': TokenType.DEFINIR,
  'COMO': TokenType.COMO,
  'ENTERO': TokenType.ENTERO,
  'REAL': TokenType.REAL,
  'CARACTER': TokenType.CARACTER,
  'CADENA': TokenType.CADENA,
  'TEXTO': TokenType.TEXTO,
  'LOGICO': TokenType.LOGICO,
  'LEER': TokenType.LEER,
  'ESCRIBIR': TokenType.ESCRIBIR,
  'SI': TokenType.SI,
  'ENTONCES': TokenType.ENTONCES,
  'SINO': TokenType.SINO,
  'FINSI': TokenType.FINSI,
  'Y': TokenType.AND,
  'O': TokenType.OR,
  'NO': TokenType.NOT,
  'VERDADERO': TokenType.VERDADERO,
  'FALSO': TokenType.FALSO
};

export class Lexer {
  constructor(input) {
    this.input = input || '';
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  peek() {
    if (this.position >= this.input.length) return null;
    return this.input[this.position];
  }

  peekNext() {
    if (this.position + 1 >= this.input.length) return null;
    return this.input[this.position + 1];
  }

  advance() {
    if (this.position >= this.input.length) return null;
    const ch = this.input[this.position];
    this.position++;
    if (ch === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return ch;
  }

  tokenize() {
    const tokens = [];

    while (this.position < this.input.length) {
      const ch = this.peek();

      // Skip whitespace except newlines if needed
      if (ch === ' ' || ch === '\t' || ch === '\r') {
        this.advance();
        continue;
      }

      if (ch === '\n') {
        const line = this.line;
        const col = this.column;
        this.advance();
        tokens.push(new Token(TokenType.NEWLINE, '\n', line, col));
        continue;
      }

      // Line comments: //
      if (ch === '/' && this.peekNext() === '/') {
        while (this.peek() !== null && this.peek() !== '\n') {
          this.advance();
        }
        continue;
      }

      // Assignment: <- or = or <= / <> / >=
      if (ch === '<') {
        const startLine = this.line;
        const startCol = this.column;
        this.advance();
        if (this.peek() === '-') {
          this.advance();
          tokens.push(new Token(TokenType.ASSIGN, '<-', startLine, startCol));
        } else if (this.peek() === '>') {
          this.advance();
          tokens.push(new Token(TokenType.NOT_EQUAL, '<>', startLine, startCol));
        } else if (this.peek() === '=') {
          this.advance();
          tokens.push(new Token(TokenType.LESS_EQUAL, '<=', startLine, startCol));
        } else {
          tokens.push(new Token(TokenType.LESS, '<', startLine, startCol));
        }
        continue;
      }

      if (ch === '>') {
        const startLine = this.line;
        const startCol = this.column;
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          tokens.push(new Token(TokenType.GREATER_EQUAL, '>=', startLine, startCol));
        } else {
          tokens.push(new Token(TokenType.GREATER, '>', startLine, startCol));
        }
        continue;
      }

      if (ch === '=') {
        const startLine = this.line;
        const startCol = this.column;
        this.advance();
        tokens.push(new Token(TokenType.EQUAL, '=', startLine, startCol));
        continue;
      }

      // Single-character punctuation / operators
      if (ch === '+') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.PLUS, '+', l, c));
        continue;
      }
      if (ch === '-') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.MINUS, '-', l, c));
        continue;
      }
      if (ch === '*') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.MULTIPLY, '*', l, c));
        continue;
      }
      if (ch === '/') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.DIVIDE, '/', l, c));
        continue;
      }
      if (ch === '^') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.POWER, '^', l, c));
        continue;
      }
      if (ch === '(') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.LPAREN, '(', l, c));
        continue;
      }
      if (ch === ')') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.RPAREN, ')', l, c));
        continue;
      }
      if (ch === ',') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.COMMA, ',', l, c));
        continue;
      }
      if (ch === ';') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.SEMICOLON, ';', l, c));
        continue;
      }
      if (ch === ':') {
        const l = this.line, c = this.column; this.advance();
        tokens.push(new Token(TokenType.COLON, ':', l, c));
        continue;
      }

      // Strings: "..." or '...'
      if (ch === '"' || ch === "'") {
        const quoteChar = ch;
        const startLine = this.line;
        const startCol = this.column;
        this.advance(); // consume opening quote
        let strVal = '';
        let closed = false;

        while (this.peek() !== null) {
          const curr = this.peek();
          if (curr === quoteChar) {
            this.advance(); // consume closing quote
            closed = true;
            break;
          }
          if (curr === '\n') {
            break; // string literal newline error
          }
          strVal += curr;
          this.advance();
        }

        if (!closed) {
          throw new Error(`Error en línea ${startLine}: Cadena de texto no cerrada.`);
        }

        tokens.push(new Token(TokenType.STRING, strVal, startLine, startCol));
        continue;
      }

      // Numbers
      if (this.isDigit(ch)) {
        const startLine = this.line;
        const startCol = this.column;
        let numStr = '';
        let hasDot = false;

        while (this.peek() !== null && (this.isDigit(this.peek()) || this.peek() === '.')) {
          if (this.peek() === '.') {
            if (hasDot) break;
            hasDot = true;
          }
          numStr += this.advance();
        }

        tokens.push(new Token(TokenType.NUMBER, parseFloat(numStr), startLine, startCol));
        continue;
      }

      // Identifiers or Keywords
      if (this.isAlpha(ch) || ch === '_') {
        const startLine = this.line;
        const startCol = this.column;
        let idStr = '';

        while (this.peek() !== null && (this.isAlphaNumeric(this.peek()) || this.peek() === '_')) {
          idStr += this.advance();
        }

        const upper = idStr.toUpperCase();
        if (KEYWORDS[upper]) {
          tokens.push(new Token(KEYWORDS[upper], idStr, startLine, startCol));
        } else {
          tokens.push(new Token(TokenType.IDENTIFIER, idStr, startLine, startCol));
        }
        continue;
      }

      // Unknown character error
      const errLine = this.line;
      const errCol = this.column;
      const invalidChar = this.advance();
      throw new Error(`Error en línea ${errLine}, columna ${errCol}: Carácter no reconocido '${invalidChar}'.`);
    }

    tokens.push(new Token(TokenType.EOF, 'EOF', this.line, this.column));
    return tokens;
  }

  isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  isAlpha(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === 'ñ' || ch === 'Ñ' ||
      ch === 'á' || ch === 'é' || ch === 'í' || ch === 'ó' || ch === 'ú' ||
      ch === 'Á' || ch === 'É' || ch === 'Í' || ch === 'Ó' || ch === 'Ú';
  }

  isAlphaNumeric(ch) {
    return this.isAlpha(ch) || this.isDigit(ch);
  }
}
