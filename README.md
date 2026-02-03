# There Be Observables

A 2-player WebGL space battle game built with RxJS and Three.js.

**More importantly, this is an experiment in exploring the limits of reactive programming and the software engineering concept of boundaries.**

## The Experiment

### Exploring Reactive Programming Limits

This project deliberately pushes RxJS to its limits by implementing:

- **Game loop as an observable stream** - The entire 60fps game tick is an RxJS `interval` with `animationFrameScheduler`
- **Physics as reactive pipelines** - Velocity, acceleration, and gravity computed through `scan` and `withLatestFrom`
- **Input as event streams** - Keyboard state managed through merged observables with `distinctUntilChanged`
- **Collision detection as stream transformation** - Raycasting results flow through the reactive pipeline
- **Entity lifecycle through subscriptions** - Spacecraft spawn/death managed by subscribing/unsubscribing

This explores where reactive programming excels (event handling, state composition) and where it creates friction (imperative Three.js mutations, object pooling for projectiles).

### Boundaries

"Boundaries" is a software engineering concept describing the pragmatic paradigm shift between functional programming and OOP/procedural programming. You can't buy a new phone every time you want to mutate the screen - at some point, you must cross the boundary and mutate state.

This codebase deliberately explores these boundaries:

- **The Observable-to-Mutation Boundary**: RxJS lets you compose pure transformations (`map`, `scan`, `filter`), but eventually you must call `model.position.add(velocity)` to mutate Three.js objects. The `.subscribe()` calls are the boundary crossings.

- **Where Boundaries Exist in This Code**:
  - `velocity$.subscribe(v => model.position.add(v))` - pure stream meets mutable Vector3
  - `renderer.render(scene, camera)` - reactive tick triggers imperative WebGL draw
  - `prj.visible = true` - observable fire event causes side effect
  - `spaceCraft.subscriptions.forEach(sub => sub.unsubscribe())` - lifecycle managed imperatively

- **The Experiment's Question**: Can you push the boundary as far out as possible? What stays functional, what must be imperative, and where does friction emerge?

## Game Controls

| Player | Thrust | Turn Left | Turn Right | Fire |
|--------|--------|-----------|------------|------|
| Player 1 (Yellow) | W | A | D | F |
| Player 2 (Red) | Arrow Up | Arrow Left | Arrow Right | Alt Right |

## Architecture

```
src/
├── index.ts                 # Entry point, wires everything together
├── Client/
│   ├── GameScene.ts         # Three.js scene, camera, renderer
│   ├── Keyboard.ts          # RxJS keyboard input streams
│   └── PlayerControls.ts    # Player control configuration
├── Spacecraft/
│   ├── SpaceCraft.ts        # Spacecraft factory with physics observables
│   ├── SpaceObject.ts       # Generic space object with position/velocity streams
│   └── Engine.ts            # Thrust observable factory
├── Physics/
│   ├── physics.ts           # Acceleration and gravity calculations
│   ├── trigonometry.ts      # Direction and orientation helpers
│   └── constants.ts         # G, WORLD_SCALE
├── Graphics/
│   ├── Planets/             # Earth, atmosphere, starfield meshes
│   ├── Rocket/              # Spacecraft 3D model
│   └── Projectile/          # Projectile 3D model
├── Game/
│   ├── constants.ts         # FPS, EARTH_RADIUS, starting positions
│   └── ScoreKeeping.ts      # Score update observable
├── CollisionDetection.ts    # Raycaster-based collision stream
├── Projectiles.ts           # Projectile pool management
└── PlayerObject.ts          # Player mesh factory
```

### Key RxJS Patterns

- `interval(1000/60, animationFrameScheduler)` - Game clock
- `fromEvent(window, 'keydown/keyup')` - Input events
- `scan((velocity, acc) => velocity.add(acc), initial)` - State accumulation
- `withLatestFrom`, `combineLatest` - Stream composition
- `exhaustMap`, `filter`, `map` - Collision handling pipeline

## Tech Stack

| Package | Version | Status |
|---------|---------|--------|
| RxJS | 6.4.0 | Outdated (current: ~7.8) |
| Three.js | 0.103.0 | Outdated (current: ~0.160) |
| TypeScript | 3.4.1 | Outdated (current: ~5.x) |
| Webpack | 4.29.6 | Outdated (current: ~5.x) |
| Jest | 24.7.1 | Outdated (current: ~29.x) |

See `docs/adr/002-modernization-plan.md` for upgrade roadmap.

## Development

### Prerequisites

- Node.js (v12+ recommended for legacy compatibility)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm start
```

Opens at http://localhost:8080

### Build

```bash
npm run build
```

Output in `dist/`

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## CI/CD

Uses Drone CI with:
- Lint + test on all commits
- S3 deployment to test bucket on pull requests
- S3 deployment to production on master merge

## Documentation

- `docs/adr/001-initial-architecture.md` - Current architecture baseline
- `docs/adr/002-modernization-plan.md` - Library upgrade roadmap

## License

ISC
