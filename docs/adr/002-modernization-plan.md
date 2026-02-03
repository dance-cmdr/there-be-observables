# ADR 002: Modernization Plan

## Status

**Completed** - February 2026

## Summary

All dependencies were successfully modernized from 2019-era versions to current releases. The experimental reactive architecture was preserved throughout.

### Final State

| Package | Before | After |
|---------|--------|-------|
| RxJS | 6.4.0 | 7.8.0 |
| Three.js | 0.103.0 | 0.170.0 |
| TypeScript | 3.4.1 | 5.3.0 |
| Build Tool | Webpack 4.29.6 | Vite 5.x |
| Test Framework | Jest 24.7.1 | Vitest 2.x |
| ESLint | 5.16.0 | 9.x |
| Prettier | 1.16.4 | 3.x |

## Context

The codebase was created in 2019 and all dependencies were significantly outdated. This ADR documents the upgrade path that was followed while preserving the experimental reactive architecture.

## Decision

Modernization was completed in phases, ordered by dependency chain and risk:

### Phase 1: Build Tooling Migration

**Webpack 4 → Vite 5**
- Replaced Webpack with Vite for faster development experience
- Moved `index.html` to project root
- Updated asset imports to use ES modules
- JSON model files required `?raw` imports with manual parsing

**Jest → Vitest**
- Migrated test configuration to Vitest
- Configured `jsdom` environment for DOM-dependent tests
- RxJS `TestScheduler` works with Vitest

### Phase 2: TypeScript & Linting

**TypeScript 3.4 → 5.3**
- Updated `tsconfig.json` for modern module resolution
- Fixed type errors from stricter checks

**ESLint 5 → 9**
- Migrated to flat config format (`eslint.config.js`)
- Configured to ignore underscore-prefixed unused variables

**Prettier 1 → 3**
- Updated config to JSON format

### Phase 3: Three.js

**Three.js 0.103 → 0.170**

Breaking changes handled:
1. `ImageUtils.loadTexture()` → `TextureLoader().load()`
2. `*BufferGeometry` types → `*Geometry` (in JSON models)
3. Lighting model changes (added `AmbientLight`, adjusted `PointLight`)
4. Color space (`SRGBColorSpace` for textures)

**Files changed:**
- `src/Graphics/Planets/Earth/Planet.ts`
- `src/Graphics/Planets/Starfield/Starfield.ts`
- `src/Graphics/Rocket/model.json`
- `src/Graphics/Projectile/icosahedron.json`
- `src/Client/GameScene.ts`

### Phase 4: RxJS

**RxJS 6.4 → 7.8**

Changes made:
1. `mapTo(value)` → `map(() => value)` (deprecated operator)
2. `combineLatest(a, b)` → `combineLatest([a, b])` (array form)
3. `debounceTime(0)` → `distinctUntilChanged()` (timing behavior)
4. Removed unused imports (`multicast`, etc.)

## Consequences

### Benefits Achieved
- Fast HMR with Vite (~250ms cold start)
- Modern TypeScript features available
- Tree-shaking and smaller bundles
- Current security patches
- Better developer experience

### Issues Encountered
- Three.js JSON model geometry types had to be renamed
- RxJS 7 `combineLatest` emits differently with `startWith` (test updates required)
- Vite requires different handling for Three.js JSON models (`?raw` imports)

### Testing Strategy Used
1. All existing tests passed before each phase
2. Manual gameplay testing after Three.js upgrade
3. Automated verification: `npm run lint && npm test && npm run build`
