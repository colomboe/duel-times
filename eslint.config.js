import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic
        },
        files: ["src/**/*.ts"],
        rules: {
            semi: "error",
            "prefer-const": "error",
            "@stylistic/quotes": "error",
        }
    },
];