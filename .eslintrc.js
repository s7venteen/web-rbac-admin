module.exports = {
  extends: ['react-app'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'semi': [2, 'never'],
    'semi-spacing': [2, {
      'before': false,
      'after': true
    }]
  }
}