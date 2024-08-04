export default {
    plugins: [
        'stylelint-scss',
    ],
    extends: [
        'stylelint-config-html',
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-standard-vue/scss',
        'stylelint-config-rational-order',
        '@stylistic/stylelint-config',
    ],
    rules: {
        // 'prettier/prettier': true,
        'selector-id-pattern': [
            '^[a-z_][a-z0-9-_]*[^-]$',
            { message: 'Expected class selector not match "^[a-z_][a-z0-9-_]*[^-]$"' },
        ],
        'selector-class-pattern': [
            '^[a-z_][a-z0-9-_]*[^-]$',
            { message: 'Expected class selector not match "^[a-z_][a-z0-9-_]*[^-]$"' },
        ],
        // 'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep'] }],

        // 声明块内添冗余的普通属性
        'declaration-block-no-redundant-longhand-properties': null,

        // 声明前有空行（与rational-order的空行冲突了）
        'declaration-empty-line-before': null,

        // 声明块单行最大声明数
        'declaration-block-single-line-max-declarations': 2,

        // 导入符号，有url和没有url是2格不同的结果
        'import-notation': null,

        // 最大嵌套深度
        'max-nesting-depth':               [3, { ignore: ['pseudo-classes'] }],
        // 选择器相关层级
        'selector-max-attribute':          2,
        'selector-max-class':              4,
        'selector-max-combinators':        3,
        'selector-max-compound-selectors': 4,

        '@stylistic/selector-list-comma-newline-after': 'always-multi-line',

        // NOTE: 还不智能，禁用
        // 禁止在覆盖更高特异性的选择器之后使用较低特异性的选择器，
        'no-descending-specificity':      null,
        'at-rule-no-unknown':             null,
        '@stylistic/no-empty-first-line': null,

        // stylelint-config-rational-order rules
        'order/properties-order': [],
        'plugin/rational-order':  [true, { 'empty-line-between-groups': true }],

        '@stylistic/indentation':     4,
    },

    // https://stylelint.io/user-guide/configure#defaultseverity
    // 默认提示严重性设置
    defaultSeverity: 'warning',
}
