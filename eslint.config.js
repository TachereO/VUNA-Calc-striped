const js = require('@eslint/js');

module.exports = [
  { ignores: ['dist/', 'coverage/', 'node_modules/', 'assets/js/bootstrap.min.js', 'assets/css/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        evaluateExpression: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        // Calculator functions called from HTML onclick
        toggleTheme: 'readonly',
        appendToResult: 'readonly',
        bracketToResult: 'readonly',
        backspace: 'readonly',
        operatorToResult: 'readonly',
        clearResult: 'readonly',
        percentToResult: 'readonly',
        calculateResult: 'readonly',
        probabilityToResult: 'readonly',
        nPr: 'readonly',
        nCr: 'readonly',
        normalizeExpression: 'readonly',
        factorial: 'readonly',
        updateResult: 'readonly',
        calculateExpression: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'eqeqeq': 'error',
      'semi': ['error', 'always']
    }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly' }
    }
  }
];