module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "google",
    "prettier",
    "plugin:jest/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  ignorePatterns: ["node_modules", "libs", "*.d.ts"],
  plugins: ["@typescript-eslint", "jest"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-undef": 2,
    "require-jsdoc": 0,
    "spaced-comment": 0,
    "@typescript-eslint/no-explicit-any": "off",
  },
  globals: {
    global: true,
    $SD: true,
    $PI: true,
    Action: true,
    Utils: true,
  },
};
