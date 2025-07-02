#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { stdin, stdout } from 'process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

// Convert string to PascalCase
const toPascalCase = (str) => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
};

// Convert string to kebab-case
const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get current package info
const getPackageInfo = async () => {
  const pkgPath = path.join(rootDir, 'packages/lib-template/package.json');
  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);
  return {
    name: pkg.name,
    scope: pkg.name.split('/')[0],
    packageName: pkg.name.split('/')[1],
  };
};

// Prompt user for new package name
const promptForNewName = async (currentInfo) => {
  return new Promise((resolve) => {
    console.log(`Current package name: ${currentInfo.name}`);
    console.log(`Current scope: ${currentInfo.scope}`);
    console.log(`Current package name: ${currentInfo.packageName}`);
    console.log('\n');

    rl.question(
      'Enter new scope (without @, e.g., "yourscope") or leave empty for no scope: ',
      (newScope) => {
        rl.question(
          'Enter new package name (e.g., "your-lib"): ',
          (newPackageName) => {
            const trimmedScope = newScope.trim();
            const trimmedPackageName = newPackageName.trim();
            const kebabPackageName = toKebabCase(trimmedPackageName);
            const pascalPackageName = toPascalCase(trimmedPackageName);

            // If no scope provided, create unscoped package name
            if (!trimmedScope) {
              resolve({
                newScope: '',
                newPackageName: kebabPackageName,
                newPascalName: pascalPackageName,
                newFullName: kebabPackageName,
              });
            } else {
              // Handle scoped package name
              const scopeWithAt = trimmedScope.startsWith('@')
                ? trimmedScope
                : `@${trimmedScope}`;
              resolve({
                newScope: scopeWithAt,
                newPackageName: kebabPackageName,
                newPascalName: pascalPackageName,
                newFullName: `${scopeWithAt}/${kebabPackageName}`,
              });
            }
          }
        );
      }
    );
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
  const newPackageDir = path.join(
    rootDir,
    `packages/${newInfo.newPackageName}`
  );

  // If the old directory exists and the new directory doesn't exist, rename it
  try {
    await fs.access(oldPackageDir);
    if (oldPackageDir !== newPackageDir) {
      await fs.mkdir(path.dirname(newPackageDir), { recursive: true });
      await fs.rename(oldPackageDir, newPackageDir);
    }
  } catch (err) {
    console.log(
      err,
      `Directory ${oldPackageDir} doesn't exist or can't be renamed.`
    );
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
        // Process TSX files (UI files - use PascalCase)
        await processDirectory(
          path.join(exampleDir, 'src'),
          ['.tsx', '.ts', '.jsx', '.js'],
          currentInfo,
          newInfo,
          true // isUIFile
        );
      } else if (example === 'svelte') {
        // Process Svelte files (UI files - use PascalCase)
        await processDirectory(
          path.join(exampleDir, 'src'),
          ['.svelte'],
          currentInfo,
          newInfo,
          true // isUIFile
        );
      } else if (example === 'vue') {
        // Process Vue files (UI files - use PascalCase)
        await processDirectory(
          path.join(exampleDir, 'src'),
          ['.vue'],
          currentInfo,
          newInfo,
          true // isUIFile
        );
      } else if (example === 'vanilla') {
        // Process HTML files (UI files - use PascalCase)
        await processDirectory(
          exampleDir,
          ['.html'],
          currentInfo,
          newInfo,
          true // isUIFile
        );
      }

      // Process markdown files in examples (excluding CHANGELOG.md)
      await processMarkdownFiles(exampleDir, currentInfo, newInfo);

      // Update package.json descriptions in examples
      await updateExamplePackageJson(exampleDir, currentInfo, newInfo);
    }
  }
};

// Process markdown files but skip CHANGELOG.md
const processMarkdownFiles = async (dir, currentInfo, newInfo) => {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await processMarkdownFiles(filePath, currentInfo, newInfo);
      } else if (path.extname(file) === '.md' && file !== 'CHANGELOG.md') {
        await updateImports(filePath, currentInfo, newInfo, false);
      }
    }
  } catch (err) {
    console.error(`Error processing markdown files in ${dir}: ${err.message}`);
  }
};

// Update package.json description in examples
const updateExamplePackageJson = async (exampleDir, currentInfo, newInfo) => {
  try {
    const pkgJsonPath = path.join(exampleDir, 'package.json');

    // Check if package.json exists
    try {
      await fs.access(pkgJsonPath);
    } catch {
      return; // Skip if no package.json exists
    }

    let content = await fs.readFile(pkgJsonPath, 'utf8');
    const pkg = JSON.parse(content);

    // Update description if it contains references to the old package name
    if (pkg.description) {
      pkg.description = pkg.description.replace(
        new RegExp(currentInfo.packageName, 'gi'),
        newInfo.newPascalName
      );
      pkg.description = pkg.description.replace(
        /lib-template/gi,
        newInfo.newPascalName
      );
      pkg.description = pkg.description.replace(
        /LibTemplate/g,
        newInfo.newPascalName
      );
    }

    // Update name if it references the old package
    if (pkg.name && pkg.name.includes('lib-template')) {
      pkg.name = pkg.name.replace(/lib-template/g, newInfo.newPackageName);
    }

    await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
  } catch (err) {
    console.error(
      `Error updating package.json in ${exampleDir}: ${err.message}`
    );
  }
};

// Update imports in test files
const updateTestImports = async (currentInfo, newInfo) => {
  console.log('Updating imports in test files...');
  await processDirectory(
    path.join(rootDir, 'test'),
    ['.ts'],
    currentInfo,
    newInfo,
    false // not UI file
  );
};

// Helper function to process files in a directory
const processDirectory = async (
  dir,
  extensions,
  currentInfo,
  newInfo,
  isUIFile = false
) => {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await processDirectory(
          filePath,
          extensions,
          currentInfo,
          newInfo,
          isUIFile
        );
      } else if (extensions.includes(path.extname(file))) {
        await updateImports(filePath, currentInfo, newInfo, isUIFile);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dir}: ${err.message}`);
  }
};

// Update imports in a single file
const updateImports = async (
  filePath,
  currentInfo,
  newInfo,
  isUIFile = false
) => {
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

    // Replace all lib-template occurrences
    if (isUIFile) {
      // For UI files, replace with PascalCase version
      content = content.replace(/lib-template/gi, newInfo.newPascalName);
      content = content.replace(/LibTemplate/g, newInfo.newPascalName);
    } else {
      // For non-UI files, replace with kebab-case version
      content = content.replace(/lib-template/g, newInfo.newPackageName);
      content = content.replace(/LibTemplate/g, newInfo.newPascalName);
    }

    // Replace any remaining package name references
    content = content.replace(
      new RegExp(currentInfo.packageName, 'g'),
      isUIFile ? newInfo.newPascalName : newInfo.newPackageName
    );

    await fs.writeFile(filePath, content, 'utf8');
  } catch (err) {
    console.error(`Error updating imports in ${filePath}: ${err.message}`);
  }
};

// Update titles in example index.html files
const updateExampleTitles = async (currentInfo, newInfo) => {
  console.log('Updating titles in example index.html files...');

  const examplesDir = path.join(rootDir, 'examples');
  const examples = await fs.readdir(examplesDir);

  for (const example of examples) {
    const exampleDir = path.join(examplesDir, example);
    const stats = await fs.stat(exampleDir);

    if (stats.isDirectory()) {
      const indexPath = path.join(exampleDir, 'index.html');
      try {
        let content = await fs.readFile(indexPath, 'utf8');
        content = content.replace(
          new RegExp(`<title>.*?</title>`, 'g'),
          `<title>${newInfo.newPascalName} Demo</title>`
        );
        await fs.writeFile(indexPath, content, 'utf8');
      } catch (err) {
        console.error(`Error updating title in ${indexPath}: ${err.message}`);
      }
    }
  }
};

// Run pnpm install
const runPnpmInstall = async () => {
  console.log('\nRunning pnpm install...');
  try {
    const { stdout, stderr } = await execAsync('pnpm install', {
      cwd: rootDir,
    });
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('pnpm install completed successfully!');
  } catch (err) {
    console.error(`Error running pnpm install: ${err.message}`);
  }
};

// Main function
const main = async () => {
  try {
    const currentInfo = await getPackageInfo();
    const newInfo = await promptForNewName(currentInfo);

    // Confirm changes
    console.log('\nAbout to make the following changes:');
    console.log(
      `- Change package name from ${currentInfo.name} to ${newInfo.newFullName}`
    );
    console.log(
      `- Update directory name from packages/lib-template to packages/${newInfo.newPackageName}`
    );
    console.log(`- Update all imports in example and test files`);
    console.log(
      `- Replace all "lib-template" strings with "${newInfo.newPackageName}" (PascalCase "${newInfo.newPascalName}" in UI files)`
    );
    console.log(`- Update titles in example index.html files`);
    console.log(
      `- Process markdown files in examples directory (excluding CHANGELOG.md)`
    );
    console.log(`- Update package.json descriptions in examples directories`);
    console.log('- CHANGELOG.md files will be preserved as-is (no changes)');
    console.log('- Run pnpm install after completion');

    rl.question('\nContinue? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        await updatePackageJsonFiles(currentInfo, newInfo);
        await updateExampleImports(currentInfo, newInfo);
        await updateTestImports(currentInfo, newInfo);
        await updateExampleTitles(currentInfo, newInfo);
        await runPnpmInstall();

        console.log('\nRename operation completed successfully!');
        console.log('\nNext steps:');
        console.log('1. pnpm build - to rebuild the library');
        console.log('2. Check if all references have been updated correctly');
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
