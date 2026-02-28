# GoogleSearch

A TTC Origins service created with the create-ttc-app generator.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode (auto-restart on changes):
   ```bash
   npm run dev
   ```

3. Or run once:
   ```bash
   npm run start
   ```

## Project Structure

- `src/index.ts` - Main server entry point (imports runServer from ttc-origin-server)
- `src/modules/` - Your service modules with @ttc.describe decorators

## Creating Modules

Create new modules in `src/modules/` using the `@ttc.describe` decorator from `ttc-rpc`.

Example:
```typescript
import { ttc } from 'ttc-rpc';

export class MyModule {
  @ttc.describe({
    description: 'My method description',
    input: ttc.z.object({}),
    output: ttc.z.string()
  })
  myMethod() {
    return 'Hello';
  }
}
```
