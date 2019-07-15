module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    // allow these things
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/prefer-interface': 0,
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'import/no-extraneous-dependencies': 0,
    'space-before-function-paren': 0,
    'arrow-parens': 0,
    'prefer-default-export': 0,
    'react/jsx-closing-bracket-location': 0,
    'max-len': 0,
    'class-methods-use-this': 0,
    'import/prefer-default-export': 0,

    // Downgrade to warnings
    '@typescript-eslint/explicit-member-accessibility': 1,

    // 'react/sort-comp': [
    //   2,
    //   {
    //     order: ['props', 'state', 'static-methods', 'lifecycle', 'everything-else', 'render'],
    //   },
    // ],
    'react-a11y/anchor-has-content': 0,
  },
  globals: {
    navigator: true,
    fetch: true,
    __DEV__: true,
  },
};
