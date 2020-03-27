module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/standard'],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'space-before-function-paren': 1,
        quotes: [1, 'single'],
        semi: 0,
        'comma-dangle': [2, 'never'],
        indent: [1, 4]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
