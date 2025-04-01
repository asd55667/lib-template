#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Function to read and parse package.json
function readPackageJson(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

// Function to write package.json
function writePackageJson(filePath, content) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
}

// Function to update version based on bump type
function updateVersion(currentVersion, bumpType) {
    const [major, minor, patch] = currentVersion?.split('.').map(Number) ?? [];

    switch (bumpType) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        default:
            return currentVersion;
    }
}

// Function to recursively find and update package.json files in example directories
function updateExamplePackageJsons(maxBumpType) {
    const examplesDir = path.join(rootDir, 'examples');
    if (!fs.existsSync(examplesDir)) {
        return;
    }

    function processDirectory(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && file !== 'node_modules') {
                processDirectory(fullPath);
            } else if (file === 'package.json') {
                const packageJson = readPackageJson(fullPath);
                packageJson.version = updateVersion(packageJson.version, maxBumpType);
                writePackageJson(fullPath, packageJson);
            }
        }
    }

    processDirectory(examplesDir);
}

// Function to process changeset files
function processChangesetFiles() {
    const changesetDir = path.join(rootDir, '.changeset');
    const files = fs.readdirSync(changesetDir).filter(file => file.endsWith('.md'));

    let maxBumpType = 'patch'; // Default to patch

    // Read all changeset files to determine the highest bump type
    for (const file of files) {
        const content = fs.readFileSync(path.join(changesetDir, file), 'utf-8');
        const match = content.match(/'([^']+)':\s*(major|minor|patch)/);
        // const libName = match ? match[1] : null;
        if (match) {
            const bumpType = match[1];
            if (bumpType === 'major' || (bumpType === 'minor' && maxBumpType === 'patch')) {
                maxBumpType = bumpType;
            }
        }
    }

    // Update root package.json
    const rootPackageJson = readPackageJson(path.join(rootDir, 'package.json'));
    rootPackageJson.version = updateVersion(rootPackageJson.version, maxBumpType);
    writePackageJson(path.join(rootDir, 'package.json'), rootPackageJson);

    // Update all package.json files in example directories
    updateExamplePackageJsons(maxBumpType);

    console.log(`Updated versions with ${maxBumpType} bump`);
}

// Execute the script
try {
    processChangesetFiles();
} catch (error) {
    console.error('Error updating versions:', error);
    process.exit(1);
}
