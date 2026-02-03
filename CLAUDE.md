# CLAUDE.md - Agent Instructions for There Be Observables

> **SYNC RULE**: This file and `.cursor/rules/project.mdc` must stay in sync.
> **CLAUDE.md is the source of truth.** If you edit this file, update `.cursor/rules/project.mdc` to match.
> A pre-commit hook runs `scripts/sync-agent-files.cjs` as a backup.

## Project Purpose

This is **an experiment in exploring the limits of reactive programming** and the software engineering concept of **boundaries**. It's a 2-player WebGL space battle game, but the game itself is secondary to the architectural experiment.

### The Experiment

The project pushes RxJS to its limits by implementing everything as observable streams:
- Game loop: `interval(1000/60, animationFrameScheduler)`
- Physics: velocity/acceleration computed through `scan` and `withLatestFrom`
- Input: keyboard state via merged `fromEvent` observables
- Collisions: raycasting results flowing through reactive pipelines
- Entity lifecycle: spawn/death via subscribe/unsubscribe

### Boundaries Concept

"Boundaries" describes the pragmatic paradigm shift between functional and imperative programming. You can't stay purely functional - at some point you must mutate state.

**The `.subscribe()` calls are the boundary crossings** - where pure RxJS streams meet Three.js mutations:
- `velocity$.subscribe(v => model.position.add(v))` 
- `renderer.render(scene, camera)`
- `prj.visible = true`

**The experiment asks**: How far out can you push the boundary? What stays functional, what must be imperative?

## Build & Run Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:8080
npm run build        # Production build to dist/
npm test             # Run Vitest tests
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
```

## Key File Locations

| File | Purpose |
|------|---------|
| `src/index.ts` | Entry point - wires game clock, players, collisions |
| `src/Client/GameScene.ts` | Three.js scene setup, render loop subscription |
| `src/Client/Keyboard.ts` | `keyPressed()`, `keyHold()`, `opposingValues()` observables |
| `src/Spacecraft/SpaceCraft.ts` | `spaceCraftFactory()` - physics observables for ships |
| `src/Spacecraft/SpaceObject.ts` | Generic position/velocity observable wrapper |
| `src/Physics/physics.ts` | `acceleration()`, `gAcceleration()` calculations |
| `src/CollisionDetection.ts` | `collisionDetection()` - raycaster stream |
| `src/Projectiles.ts` | Object pool with `createProjectile()`, `destroyProjectileWithIndex()` |

## Architecture Patterns

### Game Clock Pattern
```typescript
const gameClock$ = interval(1000 / FPS, animationFrameScheduler);
// Everything subscribes to this - physics, rendering, collision checks
```

### Physics as Stream Composition
```typescript
const velocity$ = gameClock$.pipe(
  withLatestFrom(acceleration$),
  scan((vel, acc) => vel.add(acc).add(gravity), initialVelocity)
);
```

### Input Handling
```typescript
const keyPressed = (key) => merge(
  keyDown$.pipe(filter(e => e.code === key), map(() => true)),
  keyUp$.pipe(filter(e => e.code === key), map(() => false))
).pipe(distinctUntilChanged());
```

### Boundary Crossing (Imperative Side Effects)
```typescript
velocity$.subscribe(velocity => {
  model.position.add(velocity);  // <-- THE BOUNDARY
});
```

## Testing Approach

Uses Vitest with RxJS `TestScheduler` for marble testing:

```typescript
const scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));
scheduler.run(({ cold, expectObservable }) => {
  const input$ = cold('a-b-a-|', { a: false, b: true });
  expectObservable(someOp(input$)).toBe(expected, values);
});
```

Test files: `*.test.ts` alongside source files.

## Known Issues

### TypeScript
- Some `@ts-ignore` comments for Three.js material access
- Located in: `src/PlayerObject.ts`, `src/Game/ScoreKeeping.ts`

## Tech Stack

All dependencies are current (modernized February 2026):

| Package | Version |
|---------|---------|
| RxJS | 7.8.0 |
| Three.js | 0.170.0 |
| TypeScript | 5.3.0 |
| Vite | 5.x |
| Vitest | 2.x |
| ESLint | 9.x |

See `docs/adr/002-modernization-plan.md` for modernization history.

## Game Controls Reference

| Player | Thrust | Left | Right | Fire |
|--------|--------|------|-------|------|
| P1 (Yellow) | W | A | D | F |
| P2 (Red) | ↑ | ← | → | AltRight |
