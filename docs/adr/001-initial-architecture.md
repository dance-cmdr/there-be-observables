# ADR 001: Initial Architecture - Reactive Game Loop

## Status

Accepted (Historical Baseline - circa 2019)

## Context

This project was created as **an experiment in exploring the limits of reactive programming** and the software engineering concept of **boundaries**.

The goal was to answer: *How far can you push functional reactive programming in a real-time game before you hit the boundary where imperative mutations become necessary?*

### The Boundaries Concept

"Boundaries" is a software engineering term describing the pragmatic paradigm shift between functional programming and OOP/procedural programming. You can't buy a new phone every time you want to mutate the screen - at some point, you must cross the boundary and mutate state.

## Decision

Implement a 2-player space battle game using **RxJS for everything possible**:

1. **Game Clock**: `interval(1000/60, animationFrameScheduler)` as the heartbeat
2. **Physics**: Velocity and acceleration computed through `scan` and `withLatestFrom`
3. **Input**: Keyboard state as merged `fromEvent` observables with `distinctUntilChanged`
4. **Collision Detection**: Raycasting results flowing through reactive pipelines
5. **Entity Lifecycle**: Spawn/death managed via subscribe/unsubscribe
6. **Rendering**: Three.js WebGL with scene graph mutations at the boundary

### Technology Choices (2019)

| Technology | Version | Rationale |
|------------|---------|-----------|
| RxJS | 6.4.0 | Industry-standard reactive library |
| Three.js | 0.103.0 | Mature WebGL abstraction |
| TypeScript | 3.4.1 | Type safety for complex stream compositions |
| Webpack | 4.29.6 | Standard bundler |
| Jest | 24.7.1 | Testing with RxJS TestScheduler support |

## Consequences

### Where RxJS Excels

- **Event handling**: Keyboard input composition is elegant
- **State accumulation**: `scan` for velocity is cleaner than manual state
- **Time-based operations**: `animationFrameScheduler` integration
- **Stream composition**: `withLatestFrom`, `combineLatest` for combining concerns

### Where Boundaries (Friction) Emerge

- **Three.js mutations**: Every `.subscribe()` crosses into imperative territory
  ```typescript
  velocity$.subscribe(v => model.position.add(v)); // THE BOUNDARY
  ```

- **Object pooling**: Projectiles use a pre-allocated array with imperative index management
  ```typescript
  var cp = 0; // Mutable counter - can't be purely functional
  ```

- **Lifecycle management**: Subscriptions stored in arrays, manually unsubscribed
  ```typescript
  spaceCraft.subscriptions.forEach(sub => sub.unsubscribe());
  ```

- **DOM/WebGL side effects**: `renderer.render()`, `visible = true`, etc.

### The Boundary Locations

| Location | Functional Side | Boundary | Imperative Side |
|----------|-----------------|----------|-----------------|
| SpaceCraft.ts:75 | `velocity$` stream | `.subscribe()` | `model.position.add(v)` |
| GameScene.ts:52 | `animationFrame$` | `.subscribe()` | `this.render()` |
| Projectiles.ts:62 | fire event | callback | `prj.visible = true` |
| CollisionDetection.ts | collision stream | `.subscribe()` | `destroyProjectileWithIndex()` |

### Learnings

1. **Streams excel at data flow**, but rendering is fundamentally imperative
2. **Subscription management** becomes its own concern (memory leaks)
3. **Testing is elegant** with marble diagrams and TestScheduler
4. **Object pooling** resists functional patterns (need mutable indices)

## Current State (2026)

All dependencies are now significantly outdated. See ADR-002 for modernization plan.

### Known Technical Debt

- `ImageUtils.loadTexture()` deprecated in Three.js
- ESLint config uses deprecated `prettier/@typescript-eslint`
- Typos in identifiers: `collitionDetection`, `Atmoshpere`
