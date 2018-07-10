module.exports = {
  extends: ['airbnb', 'plugin:flowtype/recommended', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  plugins: ['flowtype', 'prettier'],
  rules: {
    // allow things that airbnb forbids
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
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,

    // change airbnb rules
    'react/sort-comp': [
      2,
      {
        order: ['props', 'state', 'static-methods', 'lifecycle', 'everything-else', 'render'],
      },
    ],
    'react-a11y/anchor-has-content': 0,
  },
  globals: {
    navigator: true,
    fetch: true,
    __DEV__: true,
  },
};
