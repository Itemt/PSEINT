import { TokenType } from './token.js';
import {
  ProgramNode,
  DefineNode,
  AssignNode,
  ReadNode,
  WriteNode,
  IfNode,
  BinaryOpNode,
  UnaryOpNode,
  LiteralNode,
  VariableNode
} from './ast.js';

export class Parser {
  constructor(tokens) {
    this.tokens = tokens || [];
    this.current = 0;
  }

  peek() {
    return this.tokens[this.current] || { type: TokenType.EOF, value: '', line: 1 };
  }

  previous() {
    return this.tokens[this.current - 1] || { type: TokenType.EOF, value: '', line: 1 };
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, errorMessage) {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`Error en línea ${token.line}: ${errorMessage}`);
  }

  skipNewlinesAndSemicolons() {
    while (this.match(TokenType.NEWLINE, TokenType.SEMICOLON)) {
      // consume
    }
  }

  parse() {
    this.skipNewlinesAndSemicolons();

    let programName = 'SinTitulo';
    let isWrapped = false;
    let endTokenType = null;

    if (this.match(TokenType.PROCESO, TokenType.ALGORITMO)) {
      isWrapped = true;
      const startTok = this.previous();
      endTokenType = startTok.type === TokenType.PROCESO ? TokenType.FINPROCESO : TokenType.FINALGORITMO;

      if (this.check(TokenType.IDENTIFIER)) {
        programName = this.advance().value;
      }
    }

    const body = [];
    this.skipNewlinesAndSemicolons();

    while (!this.isAtEnd()) {
      if (isWrapped && (this.check(TokenType.FINPROCESO) || this.check(TokenType.FINALGORITMO))) {
        break;
      }
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
      this.skipNewlinesAndSemicolons();
    }

    if (isWrapped) {
      if (this.check(TokenType.FINPROCESO) || this.check(TokenType.FINALGORITMO)) {
        this.advance();
      } else {
        const expectedName = endTokenType === TokenType.FINPROCESO ? 'FinProceso' : 'FinAlgoritmo';
        const tok = this.peek();
        throw new Error(`Error en línea ${tok.line}: Se esperaba "${expectedName}".`);
      }
    }

    return new ProgramNode(programName, body, 1);
  }

  parseStatement() {
    this.skipNewlinesAndSemicolons();
    if (this.isAtEnd()) return null;

    if (this.match(TokenType.DEFINIR)) {
      return this.parseDefine();
    }

    if (this.match(TokenType.LEER)) {
      return this.parseRead();
    }

    if (this.match(TokenType.ESCRIBIR)) {
      return this.parseWrite();
    }

    if (this.match(TokenType.SI)) {
      return this.parseIf();
    }

    // Check for assignment: identifier <- expr OR identifier = expr
    if (this.check(TokenType.IDENTIFIER)) {
      const line = this.peek().line;
      const varName = this.peek().value;

      // Lookahead to see if next token is ASSIGN or EQUAL
      if (this.current + 1 < this.tokens.length) {
        const nextTok = this.tokens[this.current + 1];
        if (nextTok.type === TokenType.ASSIGN || nextTok.type === TokenType.EQUAL) {
          this.advance(); // consume identifier
          this.advance(); // consume <- or =
          const expr = this.parseExpression();
          return new AssignNode(varName, expr, line);
        }
      }
    }

    const tok = this.peek();
    throw new Error(`Error en línea ${tok.line}: Instrucción no válida o no soportada '${tok.value}'.`);
  }

  parseDefine() {
    const line = this.previous().line;
    const varNames = [];

    // Definir var1, var2 Como Tipo (comma is optional)
    const firstVar = this.consume(TokenType.IDENTIFIER, 'Se esperaba el nombre de una variable después de "Definir".');
    varNames.push(firstVar.value);

    while (this.check(TokenType.IDENTIFIER) || this.check(TokenType.COMMA)) {
      if (this.check(TokenType.COMO)) break;
      this.match(TokenType.COMMA); // optional comma
      const nextVar = this.consume(TokenType.IDENTIFIER, 'Se esperaba nombre de variable en "Definir".');
      varNames.push(nextVar.value);
    }

    this.consume(TokenType.COMO, 'Se esperaba "Como" después del nombre de las variables.');

    let typeStr = '';
    if (this.match(TokenType.ENTERO)) typeStr = 'Entero';
    else if (this.match(TokenType.REAL)) typeStr = 'Real';
    else if (this.match(TokenType.CARACTER, TokenType.CADENA, TokenType.TEXTO)) typeStr = 'Caracter';
    else if (this.match(TokenType.LOGICO)) typeStr = 'Logico';
    else {
      const tok = this.peek();
      throw new Error(`Error en línea ${tok.line}: Tipo de dato no válido '${tok.value}'. Usar Entero, Real, Caracter o Logico.`);
    }

    return new DefineNode(varNames, typeStr, line);
  }

  parseRead() {
    const line = this.previous().line;
    const varNames = [];

    const firstVar = this.consume(TokenType.IDENTIFIER, 'Se esperaba el nombre de una variable para "Leer".');
    varNames.push(firstVar.value);

    while (this.check(TokenType.IDENTIFIER) || this.check(TokenType.COMMA)) {
      this.match(TokenType.COMMA); // optional comma
      const nextVar = this.consume(TokenType.IDENTIFIER, 'Se esperaba nombre de variable en "Leer".');
      varNames.push(nextVar.value);
    }

    return new ReadNode(varNames, line);
  }

  parseWrite() {
    const line = this.previous().line;
    const expressions = [];

    expressions.push(this.parseExpression());

    // Commas separating expressions in Escribir are optional in PSeInt
    while (
      !this.check(TokenType.NEWLINE) && 
      !this.check(TokenType.SEMICOLON) && 
      !this.check(TokenType.EOF) && 
      !this.check(TokenType.FINSI) && 
      !this.check(TokenType.SINO) && 
      !this.check(TokenType.FINALGORITMO) && 
      !this.check(TokenType.FINPROCESO)
    ) {
      this.match(TokenType.COMMA); // consume comma if present
      expressions.push(this.parseExpression());
    }

    return new WriteNode(expressions, line);
  }

  parseIf() {
    const line = this.previous().line;
    const condition = this.parseExpression();

    this.consume(TokenType.ENTONCES, 'Se esperaba "Entonces" en el condicional Si.');

    const thenBranch = [];
    const elseBranch = [];

    this.skipNewlinesAndSemicolons();

    while (!this.check(TokenType.SINO) && !this.check(TokenType.FINSI) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) thenBranch.push(stmt);
      this.skipNewlinesAndSemicolons();
    }

    if (this.match(TokenType.SINO)) {
      this.skipNewlinesAndSemicolons();
      while (!this.check(TokenType.FINSI) && !this.isAtEnd()) {
        const stmt = this.parseStatement();
        if (stmt) elseBranch.push(stmt);
        this.skipNewlinesAndSemicolons();
      }
    }

    this.consume(TokenType.FINSI, 'Se esperaba "FinSi" para cerrar la estructura Si.');

    return new IfNode(condition, thenBranch, elseBranch, line);
  }

  // --- Expressions Parsing (Precedence hierarchy) ---

  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let expr = this.parseLogicalAnd();

    while (this.match(TokenType.OR)) {
      const operator = 'O';
      const line = this.previous().line;
      const right = this.parseLogicalAnd();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parseLogicalAnd() {
    let expr = this.parseEquality();

    while (this.match(TokenType.AND)) {
      const operator = 'Y';
      const line = this.previous().line;
      const right = this.parseEquality();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parseEquality() {
    let expr = this.parseRelational();

    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.parseRelational();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parseRelational() {
    let expr = this.parseAdditive();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.parseAdditive();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parseAdditive() {
    let expr = this.parseMultiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.parseMultiplicative();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parseMultiplicative() {
    let expr = this.parsePower();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.parsePower();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parsePower() {
    let expr = this.parseUnary();

    while (this.match(TokenType.POWER)) {
      const operator = '^';
      const line = this.previous().line;
      const right = this.parseUnary();
      expr = new BinaryOpNode(expr, operator, right, line);
    }

    return expr;
  }

  parseUnary() {
    if (this.match(TokenType.MINUS, TokenType.NOT)) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.parseUnary();
      return new UnaryOpNode(operator, right, line);
    }

    return this.parsePrimary();
  }

  parsePrimary() {
    if (this.match(TokenType.NUMBER)) {
      const tok = this.previous();
      return new LiteralNode(tok.value, 'NUMBER', tok.line);
    }

    if (this.match(TokenType.STRING)) {
      const tok = this.previous();
      return new LiteralNode(tok.value, 'STRING', tok.line);
    }

    if (this.match(TokenType.VERDADERO)) {
      const tok = this.previous();
      return new LiteralNode(true, 'BOOLEAN', tok.line);
    }

    if (this.match(TokenType.FALSO)) {
      const tok = this.previous();
      return new LiteralNode(false, 'BOOLEAN', tok.line);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const tok = this.previous();
      return new VariableNode(tok.value, tok.line);
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, 'Se esperaba ")" tras la expresión.');
      return expr;
    }

    const tok = this.peek();
    throw new Error(`Error en línea ${tok.line}: Se esperaba una expresión válida pero se encontró '${tok.value}'.`);
  }
}
