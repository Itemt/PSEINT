export class Environment {
  constructor(parent = null) {
    this.variables = new Map(); // key: lowercase_name -> { name, type, value, isDefined }
    this.parent = parent;
  }

  define(name, type) {
    const key = name.toLowerCase();
    let initialValue = null;

    if (type === 'Entero' || type === 'Real') {
      initialValue = 0;
    } else if (type === 'Caracter') {
      initialValue = '';
    } else if (type === 'Logico') {
      initialValue = false;
    }

    this.variables.set(key, {
      name: name,
      type: type,
      value: initialValue,
      isDefined: true,
      isAssigned: false
    });
  }

  assign(name, value, line) {
    const key = name.toLowerCase();

    if (this.variables.has(key)) {
      const varInfo = this.variables.get(key);
      const castedValue = this.castValue(value, varInfo.type, name, line);
      varInfo.value = castedValue;
      varInfo.isAssigned = true;
      return castedValue;
    }

    if (this.parent) {
      return this.parent.assign(name, value, line);
    }

    // Auto-define if not explicitly defined (PSeInt soft mode)
    let autoType = 'Real';
    if (typeof value === 'boolean') autoType = 'Logico';
    else if (typeof value === 'string') autoType = 'Caracter';
    else if (Number.isInteger(value)) autoType = 'Entero';

    this.variables.set(key, {
      name: name,
      type: autoType,
      value: value,
      isDefined: true,
      isAssigned: true
    });
    return value;
  }

  get(name, line) {
    const key = name.toLowerCase();

    if (this.variables.has(key)) {
      const varInfo = this.variables.get(key);
      if (!varInfo.isAssigned && varInfo.value === null) {
        throw new Error(`Error en línea ${line}: La variable "${name}" se usó sin haber sido inicializada.`);
      }
      return varInfo.value;
    }

    if (this.parent) {
      return this.parent.get(name, line);
    }

    throw new Error(`Error en línea ${line}: Variable "${name}" no definida.`);
  }

  isVariableDefined(name) {
    const key = name.toLowerCase();
    if (this.variables.has(key)) return true;
    if (this.parent) return this.parent.isVariableDefined(name);
    return false;
  }

  castValue(val, targetType, varName, line) {
    if (targetType === 'Entero') {
      const num = Number(val);
      if (isNaN(num)) {
        throw new Error(`Error de ejecución en línea ${line}: No se puede asignar "${val}" a la variable entera "${varName}".`);
      }
      return Math.trunc(num);
    }

    if (targetType === 'Real') {
      const num = Number(val);
      if (isNaN(num)) {
        throw new Error(`Error de ejecución en línea ${line}: No se puede asignar "${val}" a la variable real "${varName}".`);
      }
      return num;
    }

    if (targetType === 'Caracter') {
      return String(val);
    }

    if (targetType === 'Logico') {
      if (typeof val === 'boolean') return val;
      if (String(val).toLowerCase() === 'verdadero' || val === '1' || val === 1) return true;
      if (String(val).toLowerCase() === 'falso' || val === '0' || val === 0) return false;
      return Boolean(val);
    }

    return val;
  }
}
