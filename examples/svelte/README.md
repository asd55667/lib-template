# Svelte Example for lib-template

This example demonstrates how to use the `lib-template` library in a Svelte application.

## Features

- Simple calculator that uses the sum and multiply functions from lib-template
- Built with Svelte and TypeScript
- Vite-powered development server with hot module reloading

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm

### Installation

From the project root, install dependencies:

```bash
pnpm install
```

### Development

Run the development server:

```bash
# From project root
pnpm --filter svelte-example dev

# Or directly in this directory
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building

To build the application for production:

```bash
# From project root
pnpm --filter svelte-example build

# Or directly in this directory
pnpm build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/main.ts`: Entry point for the application
- `src/App.svelte`: Main application component
- `src/Calculator.svelte`: Calculator component that uses lib-template functions
- `src/styles.css`: Global styles

## License

MIT
