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
