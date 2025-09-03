#!/usr/bin/env node

/**
 * This script publishes all private packages in the packages directory to GitHub Packages
 *
 * Usage:
 * NODE_AUTH_TOKEN=your_token node publish-private-packages.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';

// Check if GitHub token is provided
const githubToken = process.env.NODE_AUTH_TOKEN;
if (!githubToken) {
    console.error(
        'Error: GitHub token is required. Please set the NODE_AUTH_TOKEN environment variable.'
    );
    console.error(
        'Usage: NODE_AUTH_TOKEN=your_token node publish-private-packages.js'
    );
    process.exit(1);
}

// Read the root package.json to extract repository info
const rootPackageJsonPath = path.resolve('./package.json');
const rootPackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf8')
);

// Extract the scope from repository URL
let correctScope = 'unknown';
if (rootPackageJson.repository && rootPackageJson.repository.url) {
    const repoUrl = rootPackageJson.repository.url;
    // Extract username from GitHub URL format: https://github.com/username/repo.git
    const match = repoUrl.match(/github\.com\/([^/]+)/);
    if (match && match[1]) {
        correctScope = match[1];
    }
}

console.log(`Using GitHub scope: ${correctScope}`);

// Path to packages directory
const packagesDir = path.resolve('./packages');

// Get all subdirectories in packages
const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

console.log(`Found ${packages.length} packages: ${packages.join(', ')}`);

// Create or update .npmrc file with GitHub authentication
const setupNpmrc = () => {
    // Create .npmrc content
    const npmrcContent = `//${correctScope}:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${githubToken}`;

    // Write to .npmrc in the package directory
    const currentDir = process.cwd();
    fs.writeFileSync(path.join(currentDir, '.npmrc'), npmrcContent);
};

// Process each package
packages.forEach((pkg) => {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');

    try {
        // Read package.json
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);

        // Check if package is private
        if (packageJson.private === true) {
            console.log(`Publishing private package: ${packageJson.name}`);

            try {
                // Store current directory
                const currentDir = process.cwd();

                // Navigate to package directory
                process.chdir(path.join(packagesDir, pkg));

                // Set up authentication for this package
                setupNpmrc();

                // Build the package if needed
                if (packageJson.scripts && packageJson.scripts.build) {
                    console.log(`Building ${packageJson.name}...`);
                    execSync('npm run build', { stdio: 'inherit' });
                }

                // Temporarily remove private flag and update package name with correct scope
                const tempPackageJson = { ...packageJson };
                delete tempPackageJson.private;

                // Store original name to restore later
                const originalName = tempPackageJson.name;

                // Update package name with correct scope
                if (
                    originalName.startsWith('@') &&
                    originalName.includes('/')
                ) {
                    // For already scoped packages, transform to kebab-case format
                    const originalScope = originalName.substring(
                        1,
                        originalName.indexOf('/')
                    );
                    const nameWithoutScope = originalName.substring(
                        originalName.indexOf('/') + 1
                    );
                    tempPackageJson.name = `@${correctScope}/${originalScope}-${nameWithoutScope}`;
                } else {
                    // For non-scoped packages, simply add the correct scope
                    tempPackageJson.name = `@${correctScope}/${originalName}`;
                }

                console.log(`Publishing as: ${tempPackageJson.name}`);

                // Add publishConfig if not present
                if (!tempPackageJson.publishConfig) {
                    tempPackageJson.publishConfig = {};
                }
                tempPackageJson.publishConfig.access = 'restricted';
                tempPackageJson.publishConfig.registry =
                    'https://npm.pkg.github.com/';

                // Write the temporary package.json
                fs.writeFileSync(
                    packageJsonPath,
                    JSON.stringify(tempPackageJson, null, 2)
                );

                // Publish to GitHub Packages
                console.log(
                    `Publishing ${tempPackageJson.name} to GitHub Packages...`
                );
                execSync('npm publish', { stdio: 'inherit' });

                console.log(`Successfully published ${tempPackageJson.name}`);

                // Restore original package.json
                fs.writeFileSync(packageJsonPath, packageJsonContent);

                // Clean up .npmrc
                if (fs.existsSync(path.join(process.cwd(), '.npmrc'))) {
                    fs.unlinkSync(path.join(process.cwd(), '.npmrc'));
                }

                // Return to original directory
                process.chdir(currentDir);
            } catch (error) {
                // Make sure to restore original package.json in case of error
                fs.writeFileSync(packageJsonPath, packageJsonContent);

                // Clean up .npmrc
                if (fs.existsSync(path.join(process.cwd(), '.npmrc'))) {
                    fs.unlinkSync(path.join(process.cwd(), '.npmrc'));
                }

                console.error(
                    `Failed to publish ${packageJson.name}:`,
                    error.message
                );
            }
        } else {
            console.log(`Skipping non-private package: ${packageJson.name}`);
        }
    } catch (error) {
        console.error(`Error processing package ${pkg}:`, error.message);
    }
});

console.log('Publishing process completed');
