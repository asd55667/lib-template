# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test                    # Run all tests once
pnpm test:watch              # Run tests in watch mode
vitest run test/sum.test.ts  # Run a single test file

# Code quality
pnpm lint                    # Run ESLint
pnpm format                  # Run Prettier

# Test framework examples
pnpm test:examples           # Test both dev servers and builds
```

## Architecture

This is a **pnpm monorepo** for building a framework-agnostic TypeScript library.

### Workspace Structure
- `packages/lib-template/` - Main library source (published as `@wcw2025/lib-template`)
- `examples/` - Framework integration examples (react, vue, solid, svelte, vanilla)
- `test/` - Vitest unit tests (root level, imports from packages)

### Build Outputs
The library produces dual builds via Rollup:
- `dist/index.cjs.js` - CommonJS
- `dist/index.esm.js` - ES Module
- `dist/index.d.ts` - TypeScript declarations

### Adding New Utilities
1. Create file in `packages/lib-template/src/utils/` (kebab-case filename)
2. Export from `packages/lib-template/src/index.ts`
3. Add tests in `test/` directory
4. Update framework examples if needed

## Code Guidelines

- **Strict TypeScript**: Use explicit type annotations for public APIs
- **Framework-agnostic**: Core library must work without framework dependencies
- **Zero dependencies**: Keep main library dependency-free for maximum compatibility
- **Tree-shaking**: Export only what's necessary, use named exports
- **JSDoc**: Document public APIs with JSDoc comments

## Renaming the Library

Run `node scripts/rename.js` to rename the library throughout the project. It handles package names, imports, and directory structure.
