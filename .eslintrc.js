module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'airbnb'],
  // plugins: ["prettier"],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-restricted-globals': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'function-paren-newline': 0,
    'object-shorthand': 0,
    'class-methods-use-this': 0,
    'linebreak-style': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'max-len': 0,
    // "prettier/prettier": ["error"],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
