# Local Context: Instance API Application

This workspace (`@tupynambalucas-hub/api`) contains the Fastify 5 REST API for community-specific instance operations.

---

## Local Architecture & Directory Map

The source code under `src/` follows a domain-driven, layered responsibility model:

- **[src/domains/](./src/domains/)**: Layered domain implementations:
  - `auth/`: Session management, Turnstile validation, and cryptographic comparisons.
  - `product/`: Catalog listing and raw text parsing ingestion rules.
  - `cycle/`: Sharing cycle windows schedule and order processing.
- **[src/plugins/](./src/plugins/)**: Fastify decorators and middleware plugins:
  - `mongoosePlugin.ts`: Enforces canonical database naming (`hubdb`) and connects Mongoose.
  - `seedPlugin.ts`: Triggers idempotent administrative user seeding.
  - `errorHandlerPlugin.ts`: Standardizes error mapping and user enumeration protection.
- **[src/models/](./src/models/)**: Database models (`user.model.ts`, `product.model.ts`, `cycle.model.ts`).
- **[src/config/](./src/config/)**: Environment variable schema and queue registries.

---

## API Coding Guardrails

### A. Layered Architecture

Every endpoint workflow MUST adhere to the following sequence:

```
Controller (Validation/Routing) ➔ Service (Business Logic) ➔ Repository (Persistence) ➔ Model (Mongoose)
```

- **Controllers**: Define routes, request schemas (Zod via `fastify-type-provider-zod`), and handle HTTP responses.
- **Services**: Contain business workflows and cross-entity transactions.
- **Repositories**: Abstract database access. **You MUST inject the Mongoose model into the repository constructor.**
- **Models**: Declare Mongoose schemas. Avoid placing business rules inside models.

### B. Mapped Repository Pattern Example

```typescript
import type { Model } from 'mongoose';
import type { IUser } from '@tupynambalucas-hub/core';

export class UserRepository {
  constructor(private readonly userModel: Model<IUser>) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
```

### C. Database Naming and Seeding

- **DB Name Override**: The `mongoosePlugin.ts` dynamically parses the Mongoose connection URI and overrides the path to `/hubdb` to ensure consistency.
- **Idempotence**: Administrative seeding MUST be idempotent using Mongoose `$setOnInsert` update operators to prevent credential overwriting on server restarts.

### D. Security Standards

- **Turnstile Verification**: Authenticated routes (e.g. `/api/auth/login`) MUST perform server-side siteverify validations against the Cloudflare siteverify endpoint.
- **User Enumeration**: Never leak user existence. Return a generic `INVALID_CREDENTIALS` error code for both username and password failures, and execute constant-time password comparisons.

---

## Local Lifecycle Commands

- `pnpm dev`: Starts the local API server using `tsx watch` at `http://localhost:3000`.
- `pnpm build`: Transpiles TypeScript files into `dist/`.
- `pnpm typecheck`: Validates local TypeScript typing.
- `pnpm lint`: Runs ESLint validation.
