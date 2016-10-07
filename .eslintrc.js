module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  rules: {
    // allow things that airbnb forbids
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'import/no-extraneous-dependencies': 0,

    // change airbnb rules
    'object-curly-spacing': [2, 'never'],
  }
};
