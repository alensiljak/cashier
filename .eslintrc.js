module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  env: {
    node: true,
    browser: true
  },

  extends: [
    "plugin:vue/base",
    // https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    //'eslint:recommended',
    //'@vue/standard'
    'plugin:vue/strongly-recommended',
    "plugin:vue/recommended",
    //'standard'
  ],

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  globals: {
    //'ga': true, // Google Analytics
    'ga': false,
    'cordova': true,
    '__statics': true,
    'process': true,
    'Capacitor': true,
    'chrome': true
  },

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',

    'import/first': 'off',
    //'import/named': 'error',
    //'import/namespace': 'error',
    //'import/default': 'error',
    //'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // customizations
    'quotes': 'off',
    //'quotes': 'warn',
    'semi': 'off',
    'space-before-function-paren': 'off',

    // vue overrides
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-mutating-props': 'off',

    // allow debugger during development only
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
