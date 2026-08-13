export class ASTNode {
  constructor(line) {
    this.line = line;
  }
}

export class ProgramNode extends ASTNode {
  constructor(name, body, line = 1) {
    super(line);
    this.type = 'ProgramNode';
    this.name = name;
    this.body = body; // Array of statement ASTNodes
  }
}

export class DefineNode extends ASTNode {
  constructor(varNames, varType, line) {
    super(line);
    this.type = 'DefineNode';
    this.varNames = varNames; // Array of strings e.g. ['kilos', 'costo']
    this.varType = varType;   // 'Entero', 'Real', 'Caracter', 'Logico'
  }
}

export class AssignNode extends ASTNode {
  constructor(varName, expression, line) {
    super(line);
    this.type = 'AssignNode';
    this.varName = varName;
    this.expression = expression;
  }
}

export class ReadNode extends ASTNode {
  constructor(varNames, line) {
    super(line);
    this.type = 'ReadNode';
    this.varNames = varNames; // Array of strings
  }
}

export class WriteNode extends ASTNode {
  constructor(expressions, line) {
    super(line);
    this.type = 'WriteNode';
    this.expressions = expressions; // Array of ASTNodes
  }
}

export class IfNode extends ASTNode {
  constructor(condition, thenBranch, elseBranch, line) {
    super(line);
    this.type = 'IfNode';
    this.condition = condition;
    this.thenBranch = thenBranch; // Array of ASTNodes
    this.elseBranch = elseBranch; // Array of ASTNodes (can be empty)
  }
}

export class BinaryOpNode extends ASTNode {
  constructor(left, operator, right, line) {
    super(line);
    this.type = 'BinaryOpNode';
    this.left = left;
    this.operator = operator; // '+', '-', '*', '/', '^', '=', '<>', '<', '<=', '>', '>=', 'Y', 'O'
    this.right = right;
  }
}

export class UnaryOpNode extends ASTNode {
  constructor(operator, operand, line) {
    super(line);
    this.type = 'UnaryOpNode';
    this.operator = operator; // '-', 'NO'
    this.operand = operand;
  }
}

export class LiteralNode extends ASTNode {
  constructor(value, literalType, line) {
    super(line);
    this.type = 'LiteralNode';
    this.value = value;
    this.literalType = literalType; // 'NUMBER', 'STRING', 'BOOLEAN'
  }
}

export class VariableNode extends ASTNode {
  constructor(name, line) {
    super(line);
    this.type = 'VariableNode';
    this.name = name;
  }
}
