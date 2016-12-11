module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
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

    // change airbnb rules
    'object-curly-spacing': [2, 'never'],
    'react/sort-comp': [2, {
      order: [
        'props',
        'state',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ],
    }],
  },
  globals: {
    navigator: true,
    fetch: true,
    __DEV__: true,
  },
};
