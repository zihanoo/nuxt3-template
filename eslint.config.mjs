// @ts-check
import stylistic from '@stylistic/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    // Your custom configs here
    stylistic.configs['recommended-flat'],
    ...pluginVue.configs['flat/recommended'],

    {
        files: ['**/*.{js,cjs,mjs,ts,vue}'],
        rules: {
            'no-console': ['warn', {
                allow: ['info', 'warn', 'error'],
            }],

            /*
                typescript-eslint
            */
            '@typescript-eslint/no-unused-vars': 'warn',

            /*
                stylistic
            */
            '@stylistic/semi':                    'warn',
            '@stylistic/indent':                  ['warn', 4],
            '@stylistic/indent-binary-ops':       ['warn', 4],
            // 最大连续空行数
            '@stylistic/no-multiple-empty-lines': ['warn', { max: 2 }],
            '@stylistic/comma-dangle':            'warn',
            '@stylistic/quotes':                  'warn',

            // 大括号式，stroustrup是一种比较清晰的段落，例如比较清晰观察到if与else的开始和逻辑块
            '@stylistic/brace-style': ['warn', 'stroustrup', {
                allowSingleLine: true,
            }],
            // '@stylistic/padded-blocks':        'off',
            '@stylistic/max-statements-per-line': ['error', { max: 2 }],
            '@stylistic/object-curly-newline':    ['warn', {
                // ObjectExpression:  null,
                ObjectPattern:     { multiline: true },
                ImportDeclaration: 'never',
                // ExportDeclaration: { multiline: true, minProperties: 3 },
            }],
            // 无多重空格，配合key-spacing一起设置
            // https://eslint.style/rules/js/no-multi-spaces
            '@stylistic/no-multi-spaces': ['warn', {
                exceptions: {
                    VariableDeclarator: true,
                    ImportDeclaration:  true, // 目前是失效的
                    Property:           true,
                    BinaryExpression:   true,
                    TSTypeAnnotation:   true,
                },
            }],
            // 键间距，属性与属性值之间对齐（需要配合设置no-multi-spaces）
            // https://eslint.style/rules/js/key-spacing
            '@stylistic/key-spacing': ['warn', {
                align: 'value',
                mode:  'minimum',
            }],
        },
    },
    {
        files: ['**/*.vue'],
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-multiple-template-root':  'off',
            'vue/html-indent':                ['warn', 4],
            'vue/first-attribute-linebreak':  ['warn', {
                singleline: 'ignore',
                multiline:  'ignore',
            }],
            // 每行属性
            'vue/max-attributes-per-line': ['warn', {
                singleline: 4,
                multiline:  1,
            }],
            // 右括号换行
            'vue/html-closing-bracket-newline': ['warn', {
                multiline: 'never',
            }],
        },
    },

    {
        ignores: [
            'node_modules',
            '**/.*',
        ],
    },
)
