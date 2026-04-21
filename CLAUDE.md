# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StorePointWeb** is an Angular 21 point-of-sale (POS) web app with iOS/Android support via Capacitor 8. It handles product catalog browsing, cart management, and sales transactions.

## Commands

```bash
npm start              # Dev server at http://localhost:4200
npm run build          # Production build
npm test               # Run unit tests (Vitest)
npm run lint           # ESLint (TypeScript + HTML)
npm run cap:sync       # Build prod + sync Capacitor native projects
npm run cap:ios        # Build + sync + open Xcode
npm run cap:android    # Build + sync + open Android Studio
```

## Architecture

### Stack
- Angular 21, standalone components only (no NgModules)
- TypeScript 5.9 with `strict: true`
- SCSS with CSS variables for theming
- Angular signals for state (no RxJS state management)
- Vitest for testing, ESLint + Angular-ESLint for linting
- Capacitor 8.3 for native iOS/Android


**Loading state**: `LoadingService` uses an increment/decrement counter. `loadingInterceptor` (functional interceptor in `app.config.ts`) auto-increments on every HTTP request and decrements on finalize. The loader only hides when the counter reaches 0 — this safely handles concurrent requests.

**Theme system**: `ThemeService` reads stored preference from `StorageService` after render, sets `data-theme` on `<html>`, and persists changes via `effect()`. CSS variables in `styles.scss` handle both themes.

**Cross-platform storage**: `StorageService` detects `Capacitor.isNativePlatform()` at runtime and routes to either `@capacitor/preferences` (native) or `localStorage` (web). Components always call `StorageService` — never touch storage directly.

**Product data**: Mock products live in `features/products/products.data.ts` and are imported by both `ProductsComponent` and `SaleComponent`. No backend integration yet.

**Component prefix**: All selectors use `stp-` (element) or `stp` (attribute), enforced by ESLint.

### Routes

```
/ → redirects to /login
/login
/notices     # placeholder
/products    # catalog with filtering
/sale        # POS checkout
```

### Environment Files

`src/environments/` has `environment.ts` (dev), `environment.dev.ts`, `environment.prod.ts`. Each exports `{ production, appName, whatsappUrl, websiteUrl, logoUrl }`. `angular.json` swaps files at build time. Access via `AppConfigService`.

### Incomplete Features (TODOs in code)

- Auth service integration (`login.component.ts`, `main-layout.component.ts`)
- Backend API calls for sale confirmation and product CRUD
- E2E test setup
