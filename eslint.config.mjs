import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescriptConfig from 'eslint-config-next/typescript';

/**
 * ESLint setup for the project.
 * Uses the official Next.js rules plus the TypeScript rules.
 */
const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescriptConfig,
];

export default eslintConfig;
