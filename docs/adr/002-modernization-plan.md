# ADR 002: Modernization Plan

## Status

Proposed

## Context

The codebase was created in 2019 and all dependencies are significantly outdated. This ADR documents the upgrade path while preserving the experimental reactive architecture.

## Current State

| Package | Current | Latest | Years Behind |
|---------|---------|--------|--------------|
| rxjs | 6.4.0 | ~7.8 | 4+ years |
| three | 0.103.0 | ~0.160 | 5+ years |
| typescript | 3.4.1 | ~5.3 | 4+ years |
| webpack | 4.29.6 | ~5.89 | 4+ years |
| jest | 24.7.1 | ~29.7 | 4+ years |
| eslint | 5.16.0 | ~8.56 | 4+ years |
| @babel/core | 7.4.3 | ~7.23 | 4+ years |

## Decision

Modernize in phases, ordered by dependency chain and risk:

### Phase 1: Foundation (Low Risk)

**TypeScript 3.4 → 5.x**
- Update `tsconfig.json` for stricter checks
- Fix any new type errors
- Enable modern features (`satisfies`, `const` type parameters)

**ESLint 5 → 8.x**
- Migrate to flat config format
- Update `@typescript-eslint` packages
- Remove deprecated `prettier/@typescript-eslint` extends

**Prettier 1 → 3.x**
- Minor config changes
- Reformat codebase

### Phase 2: Build Tooling (Medium Risk)

**Webpack 4 → 5.x**
- Replace `file-loader`, `url-loader` with asset modules
- Update `copy-webpack-plugin` syntax
- Configure `resolve.fullySpecified` for ESM

**Jest 24 → 29.x**
- Update config format
- Verify RxJS TestScheduler compatibility
- Update `@types/jest`

**Babel 7.4 → 7.23**
- Generally backwards compatible
- Update presets if needed

### Phase 3: Three.js (High Risk - Most Breaking Changes)

**Three.js 0.103 → 0.160+**

Critical breaking changes:
1. `ImageUtils.loadTexture()` removed
   ```typescript
   // Before
   material.map = ImageUtils.loadTexture(earthMap);
   
   // After
   const loader = new TextureLoader();
   material.map = loader.load(earthMap);
   ```

2. JSON model format changed
   - May need to re-export `model.json` and `icosahedron.json`
   - Or convert to GLTF format

3. Material system updates
   - Verify `MeshPhongMaterial` API
   - Check `SphereGeometry` constructor

4. Geometry changes
   - `boundingSphere` may need explicit computation

**Files requiring changes:**
- `src/Graphics/Planets/Earth/Planet.ts`
- `src/Graphics/Planets/Starfield/Starfield.ts`
- `src/Graphics/Planets/Atmoshpere/Atmoshpere.ts`
- `src/index.ts` (ObjectLoader usage)

### Phase 4: RxJS (Medium Risk)

**RxJS 6.4 → 7.x**

Changes required:
1. Import path changes (minimal with pipeable operators)
2. `schedulers` renamed/moved
3. `toPromise()` deprecated → use `firstValueFrom()`, `lastValueFrom()`

Most of the codebase uses pipeable operators, so migration should be smooth.

**Verify:**
- `animationFrameScheduler` behavior
- `TestScheduler` marble testing API

## Consequences

### Benefits
- Security patches and bug fixes
- Modern TypeScript features
- Better tree-shaking with Webpack 5
- Performance improvements in Three.js

### Risks
- Three.js upgrade is highest risk due to API changes
- May need to regenerate 3D models
- Potential subtle behavior changes in RxJS schedulers

### Testing Strategy
1. Ensure all existing tests pass before each phase
2. Manual gameplay testing after Three.js upgrade
3. Performance comparison before/after

## Rollback Plan

Use git branches for each phase:
- `modernize/phase-1-foundation`
- `modernize/phase-2-build`
- `modernize/phase-3-threejs`
- `modernize/phase-4-rxjs`

Each phase should be a separate PR that can be reverted independently.
