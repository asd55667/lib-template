// this file runs for cloudflare build
import fs from 'fs';
import path from 'path';
import process from 'process';

const npmrcContent = `
//npm.pkg.github.com/:_authToken=${process.env.NPM_GITHUB_PACKAGES}
@asd55667:registry=https://npm.pkg.github.com
`;

const currentDir = process.cwd();
const npmrcPath = path.join(currentDir, '.npmrc');

if (!fs.existsSync(npmrcPath)) {
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('.npmrc file created');
} else {
  console.log('.npmrc file already exists, skipping creation');
}
