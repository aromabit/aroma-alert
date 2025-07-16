# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js project using pnpm as the package manager. Use these commands:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## Architecture

This is a minimal Next.js 15 application with:

- **App Router structure**: Uses the new `app/` directory with `layout.tsx` and `page.tsx`
- **TypeScript**: Configured with strict mode disabled for flexibility
- **React 19**: Uses the latest React version with modern patterns
- **Japanese locale**: Root layout configured for Japanese language (`lang="ja"`)

## Code Style & Linting

- ESLint configured with TypeScript, React, React Hooks, and accessibility plugins
- Prettier for code formatting
- TypeScript with ES2017 target
- React components use functional components with TypeScript interfaces
- Unused variables prefixed with underscore are ignored by linting rules

## Project Structure

```
app/
├── layout.tsx    # Root layout with HTML structure
└── page.tsx      # Main page component (currently minimal)
```

The codebase follows Next.js App Router conventions with minimal boilerplate.