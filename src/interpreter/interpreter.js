import { Environment } from './environment.js';

export class Interpreter {
  constructor(callbacks = {}) {
    this.onOutput = callbacks.onOutput || console.log;
    this.onInputRequest = callbacks.onInputRequest || (() => Promise.resolve('0'));
    this.onError = callbacks.onError || console.error;
    this.onFinish = callbacks.onFinish || (() => {});
    this.onLineChange = callbacks.onLineChange || (() => {});
    
    this.globalEnv = new Environment();
    this.isStopped = false;
  }

  stop() {
    this.isStopped = true;
  }

  async execute(ast) {
    this.isStopped = false;
    this.globalEnv = new Environment();

    try {
      if (!ast || ast.type !== 'ProgramNode') {
        throw new Error('Árbol sintáctico no válido.');
      }

      await this.executeStatements(ast.body, this.globalEnv);

      if (!this.isStopped) {
        this.onFinish();
      }
    } catch (err) {
      if (!this.isStopped) {
        this.onError(err.message || String(err));
      }
    }
  }

  async executeStatements(statements, env) {
    for (const stmt of statements) {
      if (this.isStopped) break;
      if (stmt.line) {
        this.onLineChange(stmt.line);
      }
      await this.executeNode(stmt, env);
    }
  }

  async executeNode(node, env) {
    if (this.isStopped) return;

    switch (node.type) {
      case 'DefineNode':
        for (const name of node.varNames) {
          env.define(name, node.varType);
        }
        break;

      case 'AssignNode': {
        const val = await this.evaluateExpression(node.expression, env);
        env.assign(node.varName, val, node.line);
        break;
      }

      case 'ReadNode': {
        for (const name of node.varNames) {
          if (this.isStopped) break;
          const userInput = await this.onInputRequest(name, node.line);
          if (this.isStopped) break;
          env.assign(name, userInput, node.line);
        }
        break;
      }

      case 'WriteNode': {
        const outputParts = [];
        for (const expr of node.expressions) {
          const val = await this.evaluateExpression(expr, env);
          if (typeof val === 'boolean') {
            outputParts.push(val ? 'VERDADERO' : 'FALSO');
          } else {
            outputParts.push(String(val));
          }
        }
        // PSeInt separates multiple Write expressions with space or concats them
        this.onOutput(outputParts.join(' '));
        break;
      }

      case 'IfNode': {
        const condVal = await this.evaluateExpression(node.condition, env);
        const isTrue = this.isTruthy(condVal);
        if (isTrue) {
          await this.executeStatements(node.thenBranch, env);
        } else if (node.elseBranch && node.elseBranch.length > 0) {
          await this.executeStatements(node.elseBranch, env);
        }
        break;
      }

      default:
        throw new Error(`Error en línea ${node.line}: Tipo de nodo AST no reconocido '${node.type}'.`);
    }
  }

  async evaluateExpression(node, env) {
    if (this.isStopped) return null;

    switch (node.type) {
      case 'LiteralNode':
        return node.value;

      case 'VariableNode':
        return env.get(node.name, node.line);

      case 'UnaryOpNode': {
        const operandVal = await this.evaluateExpression(node.operand, env);
        if (node.operator === '-') {
          return -Number(operandVal);
        }
        if (node.operator === 'NO' || node.operator === 'no') {
          return !this.isTruthy(operandVal);
        }
        throw new Error(`Error en línea ${node.line}: Operador unario no válido '${node.operator}'.`);
      }

      case 'BinaryOpNode': {
        const leftVal = await this.evaluateExpression(node.left, env);
        const rightVal = await this.evaluateExpression(node.right, env);
        return this.applyBinaryOp(leftVal, node.operator, rightVal, node.line);
      }

      default:
        throw new Error(`Error en línea ${node.line}: Expresión no reconocida.`);
    }
  }

  applyBinaryOp(left, op, right, line) {
    switch (op) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return Number(left) + Number(right);

      case '-':
        return Number(left) - Number(right);

      case '*':
        return Number(left) * Number(right);

      case '/': {
        const divisor = Number(right);
        if (divisor === 0) {
          throw new Error(`Error de ejecución en línea ${line}: División por cero.`);
        }
        return Number(left) / divisor;
      }

      case '^':
        return Math.pow(Number(left), Number(right));

      // Relational
      case '=':
        return left === right || String(left) === String(right);

      case '<>':
        return left !== right && String(left) !== String(right);

      case '<':
        return Number(left) < Number(right);

      case '<=':
        return Number(left) <= Number(right);

      case '>':
        return Number(left) > Number(right);

      case '>=':
        return Number(left) >= Number(right);

      // Logical
      case 'Y':
      case 'y':
        return this.isTruthy(left) && this.isTruthy(right);

      case 'O':
      case 'o':
        return this.isTruthy(left) || this.isTruthy(right);

      default:
        throw new Error(`Error en línea ${line}: Operador binario desconocido '${op}'.`);
    }
  }

  isTruthy(val) {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      return lower === 'verdadero' || lower === 'true' || lower === '1';
    }
    return Boolean(val);
  }
}
