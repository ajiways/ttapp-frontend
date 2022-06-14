module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["@typescript-eslint/eslint-plugin", "unused-imports", "import"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
  },
  overrides: [
    {
      files: ["src/views/**/*.vue"],
      rules: {
        "vue/multi-word-component-names": 0,
      },
    },
  ],
  ignorePatterns: ["src/generated/*.ts"],
};
