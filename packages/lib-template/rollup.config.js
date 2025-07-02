import { readFileSync } from 'fs';
import { createConfig } from '../rollup.common.js';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

export default createConfig(packageJson, './tsconfig.json');
