module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [0, 'always'],
    'header-max-length': [0, 'always', 100],
  },
};
