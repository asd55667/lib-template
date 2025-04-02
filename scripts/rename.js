#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { stdin, stdout } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: stdin,
  output: stdout
});

// Get current package info
const getPackageInfo = async () => {
  const pkgPath = path.join(rootDir, 'packages/lib-template/package.json');
  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);
  return {
    name: pkg.name,
    scope: pkg.name.split('/')[0],
    packageName: pkg.name.split('/')[1]
  };
};

// Prompt user for new package name
const promptForNewName = async (currentInfo) => {
  return new Promise((resolve) => {
    console.log(`Current package name: ${currentInfo.name}`);
    console.log(`Current scope: ${currentInfo.scope}`);
    console.log(`Current package name: ${currentInfo.packageName}`);
    console.log('\n');

    rl.question('Enter new scope (without @, e.g., "yourscope"): ', (newScope) => {
      rl.question('Enter new package name (e.g., "your-lib"): ', (newPackageName) => {
        resolve({
          newScope: newScope.trim().startsWith('@') ? newScope.trim() : `@${newScope.trim()}`,
          newPackageName: newPackageName.trim(),
          newFullName: newScope.trim().startsWith('@')
            ? `${newScope.trim()}/${newPackageName.trim()}`
            : `@${newScope.trim()}/${newPackageName.trim()}`
        });
      });
    });
  });
};

// Update package.json files
const updatePackageJsonFiles = async (currentInfo, newInfo) => {
  console.log('Updating package.json files...');

  // Update root package.json
  const rootPkgPath = path.join(rootDir, 'package.json');
  let rootPkgContent = await fs.readFile(rootPkgPath, 'utf8');
  rootPkgContent = rootPkgContent.replace(
    new RegExp(`"${currentInfo.name}"`, 'g'),
    `"${newInfo.newFullName}"`
  );
  await fs.writeFile(rootPkgPath, rootPkgContent, 'utf8');

  // Update package directory name
  const oldPackageDir = path.join(rootDir, 'packages/lib-template');
  const newPackageDir = path.join(rootDir, `packages/${newInfo.newPackageName}`);

  // If the old directory exists and the new directory doesn't exist, rename it
  try {
    await fs.access(oldPackageDir);
    if (oldPackageDir !== newPackageDir) {
      await fs.mkdir(path.dirname(newPackageDir), { recursive: true });
      await fs.rename(oldPackageDir, newPackageDir);
    }
  } catch (_) {
    console.log(`Directory ${oldPackageDir} doesn't exist or can't be renamed.`);
  }

  // Update package's package.json
  const pkgJsonPath = path.join(newPackageDir, 'package.json');
  let pkgContent = await fs.readFile(pkgJsonPath, 'utf8');
  pkgContent = pkgContent.replace(
    new RegExp(`"name":\\s*"${currentInfo.name}"`, 'g'),
    `"name": "${newInfo.newFullName}"`
  );
  await fs.writeFile(pkgJsonPath, pkgContent, 'utf8');
};

// Update imports in example files
const updateExampleImports = async (currentInfo, newInfo) => {
  console.log('Updating imports in example files...');

  const examplesDir = path.join(rootDir, 'examples');
  const examples = await fs.readdir(examplesDir);

  for (const example of examples) {
    const exampleDir = path.join(examplesDir, example);
    const stats = await fs.stat(exampleDir);

    if (stats.isDirectory()) {
      // Process different file types based on framework
      if (example === 'react' || example === 'solid') {
        // Process TSX files
        await processDirectory(
          path.join(exampleDir, 'src'),
          ['.tsx', '.ts', '.jsx', '.js'],
          currentInfo,
          newInfo
        );
      } else if (example === 'svelte') {
        // Process Svelte files
        await processDirectory(
          path.join(exampleDir, 'src'),
          ['.svelte'],
          currentInfo,
          newInfo
        );
      } else if (example === 'vue') {
        // Process Vue files
        await processDirectory(
          path.join(exampleDir, 'src'),
          ['.vue'],
          currentInfo,
          newInfo
        );
      } else if (example === 'vanilla') {
        // Process HTML files
        await processDirectory(
          exampleDir,
          ['.html'],
          currentInfo,
          newInfo
        );
      }
    }
  }
};

// Update imports in test files
const updateTestImports = async (currentInfo, newInfo) => {
  console.log('Updating imports in test files...');
  await processDirectory(
    path.join(rootDir, 'test'),
    ['.ts'],
    currentInfo,
    newInfo
  );
};

// Helper function to process files in a directory
const processDirectory = async (dir, extensions, currentInfo, newInfo) => {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await processDirectory(filePath, extensions, currentInfo, newInfo);
      } else if (extensions.includes(path.extname(file))) {
        await updateImports(filePath, currentInfo, newInfo);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dir}: ${err.message}`);
  }
};

// Update imports in a single file
const updateImports = async (filePath, currentInfo, newInfo) => {
  try {
    let content = await fs.readFile(filePath, 'utf8');

    // Replace import statements
    content = content.replace(
      new RegExp(`from\\s+['"]${currentInfo.name}['"]`, 'g'),
      `from '${newInfo.newFullName}'`
    );

    // Replace import comments
    content = content.replace(
      new RegExp(`from\\s+['"]@[^/]+/lib-template['"]`, 'g'),
      `from '${newInfo.newFullName}'`
    );

    await fs.writeFile(filePath, content, 'utf8');
  } catch (err) {
    console.error(`Error updating imports in ${filePath}: ${err.message}`);
  }
};

// Main function
const main = async () => {
  try {
    const currentInfo = await getPackageInfo();
    const newInfo = await promptForNewName(currentInfo);

    // Confirm changes
    console.log('\nAbout to make the following changes:');
    console.log(`- Change package name from ${currentInfo.name} to ${newInfo.newFullName}`);
    console.log(`- Update directory name from packages/lib-template to packages/${newInfo.newPackageName}`);
    console.log(`- Update all imports in example and test files`);

    rl.question('\nContinue? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        await updatePackageJsonFiles(currentInfo, newInfo);
        await updateExampleImports(currentInfo, newInfo);
        await updateTestImports(currentInfo, newInfo);

        console.log('\nRename operation completed successfully!');
        console.log('\nYou may need to run the following commands:');
        console.log('1. pnpm install - to update dependencies');
        console.log('2. pnpm build - to rebuild the library');
      } else {
        console.log('Operation cancelled.');
      }
      rl.close();
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    rl.close();
  }
};

main();
