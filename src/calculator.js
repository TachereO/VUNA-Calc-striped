'use strict';

/**
 * VUNA Calculator — Pure Math Engine
 * No DOM, no eval(). Testable pure functions.
 */

/* ──────────────────────────────────────────
   Tokenizer → Shunting-yard → RPN evaluator
   ────────────────────────────────────────── */

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/\d/.test(ch) || ch === '.') {
      let num = '';
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    if (ch === 'n' && expr.slice(i, i + 3) === 'nPr') {
      tokens.push({ type: 'operator', value: 'nPr', precedence: 4, assoc: 'left' });
      i += 3;
      continue;
    }

    if (ch === 'n' && expr.slice(i, i + 3) === 'nCr') {
      tokens.push({ type: 'operator', value: 'nCr', precedence: 4, assoc: 'left' });
      i += 3;
      continue;
    }

    if ('+-*/'.includes(ch)) {
      const precedence = (ch === '+' || ch === '-') ? 1 : 2;
      tokens.push({ type: 'operator', value: ch, precedence, assoc: 'left' });
      i++;
      continue;
    }

    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i++;
      continue;
    }

    throw new Error('Invalid character: ' + ch);
  }
  return tokens;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'operator') {
      while (
        stack.length > 0 &&
        stack[stack.length - 1].type === 'operator' &&
        ((token.assoc === 'left' && token.precedence <= stack[stack.length - 1].precedence) ||
         (token.assoc === 'right' && token.precedence < stack[stack.length - 1].precedence))
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    } else if (token.value === '(') {
      stack.push(token);
    } else if (token.value === ')') {
      while (stack.length > 0 && stack[stack.length - 1].value !== '(') {
        output.push(stack.pop());
      }
      if (stack.length === 0) throw new Error('Mismatched parentheses');
      stack.pop();
    }
  }

  while (stack.length > 0) {
    const op = stack.pop();
    if (op.value === '(' || op.value === ')') throw new Error('Mismatched parentheses');
    output.push(op);
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === 'number') {
      stack.push(token.value);
    } else if (token.type === 'operator') {
      if (token.value === 'nPr' || token.value === 'nCr') {
        const r = stack.pop();
        const n = stack.pop();
        if (n === undefined || r === undefined) throw new Error('Insufficient operands for ' + token.value);
        stack.push(token.value === 'nPr' ? nPr(n, r) : nCr(n, r));
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error('Insufficient operands');
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/':
            if (b === 0) throw new Error('Division by zero');
            stack.push(a / b);
            break;
        }
      }
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

/* ──────────────────────────────────────────
   Public API
   ────────────────────────────────────────── */

function evaluateExpression(expr) {
  if (!expr || expr.trim() === '') return 0;
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  const result = evaluateRPN(rpn);
  if (!isFinite(result) || isNaN(result)) throw new Error('Invalid result');
  return result;
}

/* ──────────────────────────────────────────
   Probability helpers (nPr / nCr)
   ────────────────────────────────────────── */

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function nPr(n, r) {
  n = Math.round(n);
  r = Math.round(r);
  if (r > n || n < 0 || r < 0) return NaN;
  return factorial(n) / factorial(n - r);
}

function nCr(n, r) {
  n = Math.round(n);
  r = Math.round(r);
  if (r > n || n < 0 || r < 0) return NaN;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/* ──────────────────────────────────────────
   Module exports for Node.js testing
   ────────────────────────────────────────── */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluateExpression, nPr, nCr };
}