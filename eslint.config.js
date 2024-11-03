import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
    perfectionist.configs['recommended-natural'],
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
            parser: parser,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tseslint,
            import: importPlugin,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...eslint.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            '@typescript-eslint/no-explicit-any': 'off',
            'prettier/prettier': ['error'],
            radix: 'off',
        },
    },
    {
        ignores: ['node_modules/**'],
    },
];
