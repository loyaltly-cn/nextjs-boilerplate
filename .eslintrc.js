module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_'
    }],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off'
  }
} 