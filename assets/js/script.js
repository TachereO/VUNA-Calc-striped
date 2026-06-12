// ===============================
// Message Display Helper
// ===============================
function showMessage(message, isError) {
  if (typeof window !== "undefined" && window.alert) {
    window.alert(message);
  } else {
    console.warn(message);
  }
}

// ===============================
// SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}

function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;
    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];
    if (!rightPart) return;
    let leftVal;
    try {
      leftVal = evaluateExpression(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }
    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;
    const percentVal = (leftVal * rightVal) / 100;
    currentExpression = percentVal.toString();
  }
  currentExpression += "*";
  updateResult();
}

// ------------------------------
// Calculate Result — NO eval()
// ------------------------------
function calculateExpression(expression) {
  try {
    let normalizedExpression = normalizeExpression(expression);
    normalizedExpression = normalizedExpression.replace(/\bans\b/gi, LAST_RESULT);
    let result = evaluateExpression(normalizedExpression);
    console.log("Calculated result for expression:", expression, "->", result);
    return result;
  } catch (e) {
    return "Error";
  }
}

function calculateResult() {
  if (!currentExpression) return;
  const display = document.getElementById("result");
  let result = calculateExpression(currentExpression);
  result = String(result);
  LAST_RESULT = result;
  display.value = result;
  currentExpression = result;
  updateResult();
}

function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// ------------------------------
// Factorial Helper Function
// ------------------------------
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// ------------------------------
// Calculate Factorial of Current Number (n!)
// ------------------------------
function calculateFactorial() {
  if (!currentExpression) return;
  const n = parseFloat(currentExpression);
  if (isNaN(n) || !Number.isInteger(n) || n < 0) {
    currentExpression = "Error";
    updateResult();
    return;
  }
  if (n > 170) {
    currentExpression = "Infinity";
    updateResult();
    return;
  }
  const result = factorial(n);
  currentExpression = result.toString();
  updateResult();
}

// ------------------------------
// Probability: nPr and nCr
// ------------------------------
function probabilityToResult(type) {
  if (!currentExpression) return;
  currentExpression += type === "nPr" ? "nPr" : "nCr";
  updateResult();
}

// ============================================
// PROBABILITY CALCULATOR FUNCTIONS
// ============================================

function updateProbabilityInputs() {
  const probType = document.getElementById("probability-type").value;
  const container = document.getElementById("probability-inputs-container");
  const resultDiv = document.getElementById("probability-result");

  if (container) {
    container.innerHTML = "";
    container.classList.remove("has-content");
  }
  if (resultDiv) resultDiv.style.display = "none";

  if (!probType) {
    if (container) {
      container.innerHTML = '<p class="text-muted text-center mb-0" id="prob-placeholder"><em>👆 Select a calculation type above to enter values</em></p>';
    }
    return;
  }

  if (container) container.classList.add("has-content");

  let inputsHTML = "";

  switch (probType) {
    case "single":
      inputsHTML = '<div class="mb-3"><label class="form-label small fw-bold">Favorable Outcomes</label><input type="number" class="form-control" id="prob-favorable" placeholder="e.g., 1" step="any" min="0" value="1"></div><div class="mb-3"><label class="form-label small fw-bold">Total Possible Outcomes</label><input type="number" class="form-control" id="prob-total" placeholder="e.g., 6" step="any" min="1" value="6"></div><div class="alert alert-warning py-2 px-3 mb-0"><strong>Formula:</strong> P(A) = Favorable / Total</div>';
      break;

    case "and":
      inputsHTML = '<div class="mb-3"><label class="form-label small fw-bold">Probability of Event A (P(A))</label><input type="number" class="form-control" id="prob-a" placeholder="e.g., 0.5" step="0.01" min="0" max="1" value="0.5"></div><div class="mb-3"><label class="form-label small fw-bold">Probability of Event B (P(B))</label><input type="number" class="form-control" id="prob-b" placeholder="e.g., 0.5" step="0.01" min="0" max="1" value="0.5"></div><div class="alert alert-warning py-2 px-3 mb-0"><strong>Formula:</strong> P(A and B) = P(A) × P(B) (for independent events)</div>';
      break;

    case "or":
      inputsHTML = '<div class="mb-3"><label class="form-label small fw-bold">Probability of Event A (P(A))</label><input type="number" class="form-control" id="prob-a-or" placeholder="e.g., 0.25" step="0.01" min="0" max="1" value="0.25"></div><div class="mb-3"><label class="form-label small fw-bold">Probability of Event B (P(B))</label><input type="number" class="form-control" id="prob-b-or" placeholder="e.g., 0.25" step="0.01" min="0" max="1" value="0.25"></div><div class="alert alert-warning py-2 px-3 mb-0"><strong>Formula:</strong> P(A or B) = P(A) + P(B) (for mutually exclusive events)</div>';
      break;

    case "conditional":
      inputsHTML = '<div class="mb-3"><label class="form-label small fw-bold">Probability of A and B (P(A∩B))</label><input type="number" class="form-control" id="prob-a-and-b" placeholder="e.g., 0.1" step="0.01" min="0" max="1" value="0.1"></div><div class="mb-3"><label class="form-label small fw-bold">Probability of B (P(B))</label><input type="number" class="form-control" id="prob-b-cond" placeholder="e.g., 0.2" step="0.01" min="0" max="1" value="0.2"></div><div class="alert alert-warning py-2 px-3 mb-0"><strong>Formula:</strong> P(A|B) = P(A∩B) / P(B)</div>';
      break;

    case "binomial":
      inputsHTML = '<div class="mb-3"><label class="form-label small fw-bold">Number of Trials (n)</label><input type="number" class="form-control" id="prob-trials" placeholder="e.g., 5" step="1" min="1" value="5"></div><div class="mb-3"><label class="form-label small fw-bold">Number of Successes (k)</label><input type="number" class="form-control" id="prob-successes" placeholder="e.g., 3" step="1" min="0" value="3"></div><div class="mb-3"><label class="form-label small fw-bold">Probability of Success per Trial (p)</label><input type="number" class="form-control" id="prob-p" placeholder="e.g., 0.5" step="0.01" min="0" max="1" value="0.5"></div><div class="alert alert-warning py-2 px-3 mb-0"><strong>Formula:</strong> P(X=k) = C(n,k) × pᵏ × (1-p)ⁿ⁻ᵏ</div>';
      break;

    case "complement":
      inputsHTML = '<div class="mb-3"><label class="form-label small fw-bold">Probability of Event (P(A))</label><input type="number" class="form-control" id="prob-a-comp" placeholder="e.g., 0.3" step="0.01" min="0" max="1" value="0.3"></div><div class="alert alert-warning py-2 px-3 mb-0"><strong>Formula:</strong> P(A\') = 1 - P(A)</div>';
      break;
  }

  if (container) container.innerHTML = inputsHTML;
}

function combination(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - k + i) / i;
  }
  return result;
}

function calculateProbability() {
  const probType = document.getElementById("probability-type").value;
  const resultDiv = document.getElementById("probability-result");
  const probValueSpan = document.getElementById("probability-value");
  const formulaSpan = document.getElementById("probability-formula");
  const explanationSpan = document.getElementById("probability-explanation");

  if (!probType) {
    showMessage("Please select a calculation type from the dropdown first.", true);
    return;
  }

  let result = null;
  let formula = "";
  let explanation = "";

  try {
    switch (probType) {
      case "single": {
        const favorable = parseFloat(document.getElementById("prob-favorable").value);
        const total = parseFloat(document.getElementById("prob-total").value);
        if (isNaN(favorable) || isNaN(total) || total <= 0 || favorable < 0) {
          throw new Error("Invalid input. Please ensure Favorable Outcomes is >= 0 and Total Outcomes is > 0.");
        }
        result = favorable / total;
        formula = "P(A) = " + favorable + " / " + total;
        explanation = "The probability of the event occurring is " + result.toFixed(4) + ".";
        break;
      }

      case "and": {
        const pA = parseFloat(document.getElementById("prob-a").value);
        const pB = parseFloat(document.getElementById("prob-b").value);
        if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) {
          throw new Error("Probabilities must be between 0 and 1.");
        }
        result = pA * pB;
        formula = "P(A and B) = " + pA.toFixed(4) + " × " + pB.toFixed(4);
        explanation = "The probability of both independent events occurring is " + result.toFixed(4) + ".";
        break;
      }

      case "or": {
        const pA = parseFloat(document.getElementById("prob-a-or").value);
        const pB = parseFloat(document.getElementById("prob-b-or").value);
        if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) {
          throw new Error("Probabilities must be between 0 and 1.");
        }
        result = pA + pB;
        if (result > 1) result = 1;
        formula = "P(A or B) = " + pA.toFixed(4) + " + " + pB.toFixed(4);
        explanation = "The probability of either event occurring (mutually exclusive) is " + result.toFixed(4) + ".";
        break;
      }

      case "conditional": {
        const pAandB = parseFloat(document.getElementById("prob-a-and-b").value);
        const pB = parseFloat(document.getElementById("prob-b-cond").value);
        if (isNaN(pAandB) || isNaN(pB) || pAandB < 0 || pAandB > 1 || pB <= 0 || pB > 1) {
          throw new Error("P(A∩B) must be between 0 and 1, and P(B) must be between >0 and 1.");
        }
        result = pAandB / pB;
        if (result > 1) result = 1;
        formula = "P(A|B) = " + pAandB.toFixed(4) + " / " + pB.toFixed(4);
        explanation = "The probability of event A given that B has occurred is " + result.toFixed(4) + ".";
        break;
      }

      case "binomial": {
        const n = parseInt(document.getElementById("prob-trials").value);
        const k = parseInt(document.getElementById("prob-successes").value);
        const p = parseFloat(document.getElementById("prob-p").value);
        if (isNaN(n) || isNaN(k) || isNaN(p) || n < 1 || k < 0 || k > n || p < 0 || p > 1) {
          throw new Error("Invalid input. Ensure n >= 1, 0 <= k <= n, and 0 <= p <= 1.");
        }
        const comb = combination(n, k);
        result = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
        formula = "C(" + n + ", " + k + ") × " + p.toFixed(2) + "^" + k + " × (1-" + p.toFixed(2) + ")^" + (n - k);
        explanation = "The probability of getting exactly " + k + " successes in " + n + " trials is " + result.toFixed(6) + ".";
        break;
      }

      case "complement": {
        const pA = parseFloat(document.getElementById("prob-a-comp").value);
        if (isNaN(pA) || pA < 0 || pA > 1) {
          throw new Error("Probability must be between 0 and 1.");
        }
        result = 1 - pA;
        formula = "P(A') = 1 - " + pA.toFixed(4);
        explanation = "The probability of the event NOT occurring is " + result.toFixed(4) + ".";
        break;
      }
    }

    if (result !== null && probValueSpan && formulaSpan && explanationSpan && resultDiv) {
      probValueSpan.textContent = result.toFixed(6);
      formulaSpan.textContent = formula;
      explanationSpan.textContent = explanation;
      resultDiv.style.display = "block";
      currentExpression = result.toString();
      updateResult();
    }
  } catch (error) {
    showMessage("Error: " + error.message, true);
    if (resultDiv) resultDiv.style.display = "none";
  }
}

function clearProbabilityCalculator() {
  const probType = document.getElementById("probability-type");
  const container = document.getElementById("probability-inputs-container");
  const resultDiv = document.getElementById("probability-result");

  if (probType) probType.value = "";
  if (container) {
    container.innerHTML = '<p class="text-muted text-center mb-0" id="prob-placeholder"><em>👆 Select a calculation type above to enter values</em></p>';
    container.classList.remove("has-content");
  }
  if (resultDiv) resultDiv.style.display = "none";
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (!isNaN(key)) {
    appendToResult(key);
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    operatorToResult(key);
  } else if (key === "Enter") {
    calculateResult();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearResult();
  } else if (key === "(" || key === ")") {
    bracketToResult(key);
  } else if (key === ".") {
    appendToResult(key);
  }
});