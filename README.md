# TypeScript Library Template

A modern TypeScript library template with Rollup bundling and Vitest testing.

## Features

- 📦 TypeScript 5.8+ setup with strict typings
- 🔄 Rollup for bundling (CommonJS and ESM outputs)
- ✅ Vitest for unit testing with coverage reports
- 🧹 ESLint and Prettier for code quality
- 📝 Type declarations included in build
- 🧪 Example implementations (Vanilla JS, React, Vue, Solid, and Svelte)
- 🔄 Automated testing of example projects

## Installation

```bash
pnpm install
```

## Renaming Your Library

This template includes a powerful rename script that automatically updates your library name throughout the entire project. This is typically the first thing you'll want to do after cloning the template.

### Quick Start

```bash
node scripts/rename.js
```

The script will prompt you for:

1. **New scope** (optional): Enter your scope without the `@` symbol (e.g., `yourscope`) or leave empty for unscoped packages
2. **New package name**: Enter your library name (e.g., `my-awesome-lib`)

### What It Does

The rename script automatically:

- ✅ Updates `package.json` files with the new package name
- ✅ Renames the package directory from `packages/lib-template` to `packages/your-new-name`
- ✅ Updates all import statements in example projects
- ✅ Replaces `lib-template` references with your new name throughout the codebase
- ✅ Updates titles in example HTML files
- ✅ Processes markdown files in examples (preserves CHANGELOG.md)
- ✅ Updates package descriptions in example projects
- ✅ Runs `pnpm install` to update dependencies

### Example

If you enter:

- Scope: `mycompany`
- Package name: `awesome-utils`

The script will:

- Create package name: `@mycompany/awesome-utils`
- Use kebab-case for file references: `awesome-utils`
- Use PascalCase for UI components: `AwesomeUtils`

### What's Preserved

- ✅ CHANGELOG.md files remain unchanged
- ✅ Git history is preserved
- ✅ All functionality and structure remain intact

After running the rename script, your library will be fully renamed and ready for development!

## Development

```bash
# Start development with watch mode
pnpm dev

# Run tests
pnpm test

# Run tests with watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build

# Test all examples (both dev and build)
pnpm test:examples

# Test only dev servers in examples
pnpm test:examples:dev

# Test only builds in examples
pnpm test:examples:build
```

## Usage

After building the package:

### Vanilla JS

```bash
cd examples/vanilla
# Serve with a local server
npx serve
```

### Framework Examples

The template includes examples for multiple frameworks:

```bash
# React
cd examples/react
pnpm install
pnpm dev

# Vue
cd examples/vue
pnpm install
pnpm dev

# Solid
cd examples/solid
pnpm install
pnpm dev

# Svelte
cd examples/svelte
pnpm install
pnpm dev
```

## Testing Examples

The library includes automated scripts to test all example projects:

- `pnpm test:examples` - Tests both dev servers and builds for all examples
- `pnpm test:examples:dev` - Tests only the dev servers
- `pnpm test:examples:build` - Tests only the builds

These scripts help ensure that your library works correctly with all supported frameworks.

## Publishing

Before publishing, make sure to:

1. Update the version in `package.json`
2. Build the package: `pnpm build`
3. Test the package: `pnpm test`
4. Test with all examples: `pnpm test:examples`

Then publish with:

```bash
pnpm publish
```

## License

MIT
