#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

// Get the directory of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const examplesDir = join(rootDir, 'examples');

// Command to test: defaults to both 'dev' and 'build'
const commandToTest = process.argv[2] || 'all';

// Helper function to get script command for a specific example
function getScriptCommand(exampleName, scriptName) {
  try {
    const packageJsonPath = join(examplesDir, exampleName, 'package.json');
    if (!existsSync(packageJsonPath)) {
      return null;
    }

    const packageJson = JSON.parse(execSync(`cat ${packageJsonPath}`).toString());
    const scripts = packageJson.scripts || {};

    // Handle variations of script names (e.g., start vs dev)
    if (scriptName === 'dev' && !scripts.dev && scripts.start) {
      return 'start';
    }

    return scripts[scriptName] ? scriptName : null;
  } catch (error) {
    console.error(`Error checking scripts in ${exampleName}:`, error.message);
    return null;
  }
}

// Function to test a specific command in an example directory
function testCommand(exampleName, command) {
  const scriptName = getScriptCommand(exampleName, command);
  if (!scriptName) {
    console.log(`⚠️  ${exampleName}: No '${command}' script found, skipping`);
    return { passed: true, skipped: true }; // Not an error, just skipped
  }

  console.log(`🧪 Testing '${command}' in ${exampleName}...`);
  try {
    // For dev command, use spawn to better manage the process
    if (command === 'dev') {
      return new Promise((resolve) => {
        const cwd = join(examplesDir, exampleName);
        const devProcess = spawn('pnpm', ['run', scriptName], {
          cwd,
          shell: true,
          stdio: 'inherit',
        });

        // Give the dev server some time to start up
        setTimeout(() => {
          console.log(`✅ ${exampleName}: '${command}' started successfully, shutting down...`);
          // Properly terminate the process
          devProcess.kill();
          resolve({ passed: true, skipped: false });
        }, 7000); // Wait 7 seconds

        devProcess.on('error', (error) => {
          console.error(`❌ ${exampleName}: '${command}' failed with error:`, error.message);
          resolve({ passed: false, skipped: false, name: exampleName, command });
        });
      });
    } else {
      execSync(`cd ${join(examplesDir, exampleName)} && pnpm run ${scriptName}`, {
        stdio: 'inherit'
      });
      console.log(`✅ ${exampleName}: '${command}' passed`);
      return { passed: true, skipped: false };
    }
  } catch (error) {
    console.error(`❌ ${exampleName}: '${command}' failed with error:`, error.message);
    return { passed: false, skipped: false, name: exampleName, command };
  }
}

// Main function to run tests
async function runTests() {
  const failedExamples = [];
  const examples = readdirSync(examplesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${examples.length} examples: ${examples.join(', ')}`);

  for (const example of examples) {
    if (commandToTest === 'all' || commandToTest === 'dev') {
      const devResult = await testCommand(example, 'dev');
      if (!devResult.passed && !devResult.skipped) {
        failedExamples.push(`${example} (dev)`);
      }
    }

    if (commandToTest === 'all' || commandToTest === 'build') {
      const buildResult = await testCommand(example, 'build');
      if (!buildResult.passed && !buildResult.skipped) {
        failedExamples.push(`${example} (build)`);
      }
    }

    console.log('-------------------');
  }

  if (failedExamples.length === 0) {
    console.log('🎉 All tests passed successfully!');
    process.exit(0);
  } else {
    console.error('❌ The following examples failed:');
    failedExamples.forEach(failed => {
      console.error(`   - ${failed}`);
    });
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
