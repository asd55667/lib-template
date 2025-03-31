# SolidJS Example for lib-template

This example demonstrates how to use the `lib-template` library in a SolidJS application.

## Features

- Simple calculator that uses the `sum` and `multiply` functions from lib-template
- Demonstrates integration with SolidJS components and reactivity
- Uses SolidJS's fine-grained reactivity system with signals

## Installation

From the root of the project:

```bash
# Install dependencies for the library and all examples
pnpm install
```

## Development

To run the example:

```bash
# From the root of the project
cd examples/solid
pnpm dev
```

This will start a development server at `http://localhost:3000/`.

## Structure

- `src/Calculator.tsx` - Uses the lib-template library functions
- `src/App.tsx` - Main application component
- `src/index.tsx` - Entry point

## Notes

This example demonstrates how to use the lib-template library in a modern SolidJS application with TypeScript. It shows how to:

1. Import and use the library functions
2. Create reactive state with SolidJS signals
3. Handle user input
4. Conditionally render UI elements
