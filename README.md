# TypeScript Library Template

A modern TypeScript library template with Rollup bundling and Vitest testing.

## Features

- 📦 TypeScript 5.8+ setup with strict typings
- 🔄 Rollup for bundling (CommonJS and ESM outputs)
- ✅ Vitest for unit testing with coverage reports
- 🧹 ESLint and Prettier for code quality
- 📝 Type declarations included in build
- 🧪 Example implementations (Vanilla JS and React)

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
```

## Usage

After building the package:

### Vanilla JS

```bash
cd example/vanilla
# Serve with a local server
npx serve
```

### React Example

```bash
cd example/react
pnpm install
pnpm dev
```

## Publishing

Before publishing, make sure to:

1. Update the version in `package.json`
2. Build the package: `pnpm build`
3. Test the package: `pnpm test`

Then publish with:

```bash
pnpm publish
```

## License

MIT