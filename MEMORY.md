# Auth Project — Persistent Project Memory


**Stack**: Express.js + TypeScript + Prisma 7 + PostgreSQL  
**Repo**: `git@github.com:rijalrf/auth-test.git`

---

## Project Structure

```
src/
├── utils/
│   ├── errors.ts          ← ApiError class
│   └── response.ts        ← sendSuccess / sendError
├── schema/
│   └── users.validation.ts ← Zod schemas (registerSchema, loginSchema)
├── types/
│   └── users.types.ts     ← Interfaces (RegisterInput/Result, LoginInput/Result)
├── services/
│   └── users.service.ts   ← Business logic (registerUser, loginUser)
├── routes/
│   └── users.routes.ts    ← HTTP handlers (POST /api/users/register, /login)
└── generated/
    └── prisma/            ← Auto-generated Prisma client (DO NOT edit)
prisma/
├── schema.prisma          ← Models: User, Session
└── migrations/            ← Auto-generated
```

---

## Reusable Patterns & Imports

### ApiError — semantic error
```ts
import { ApiError } from '../utils/errors.js';

throw new ApiError('message', 'ERROR_CODE', 400);
// Args: message (string), code (string), status (number, default 500)
```

### Response helpers — standardized JSON shape
```ts
import { sendSuccess, sendError } from '../utils/response.js';

sendSuccess(res, 'Success message', data, 200);   // → { success, message, data }
sendError(res, 'Error msg', 'ERROR_CODE', 400);   // → { success:false, message[, code] }
```

### Zod validation — safeParse before service call
```ts
import * as userValidation from '../schema/users.validation.js';

const parsed = userValidation.loginSchema.safeParse(req.body);
if (!parsed.success) { /* parsed.error.issues */ }
// Then pass parsed.data to service — fully typed
```

### Service pattern — prisma DI, throw ApiError
```ts
import { PrismaClient } from '../generated/prisma/client.js';

export const fn = async (prisma: PrismaClient, input: InputType): Promise<ResultType> => {
  // business logic, throw ApiError on failure
};
```

### Route pattern — validation → service → response
```ts
router.post('/path', async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) { sendError(res, /*...*/); return; }
    const result = await service(prisma, parsed.data);
    sendSuccess(res, 'msg', result, 200);
  } catch (err) {
    if (err instanceof ApiError) { sendError(res, err.message, err.code, err.status); return; }
    sendError(res, 'Internal server error', 'DB_ERROR', 500);
  }
});
```

### Prisma client — singleton via index.ts
```ts
import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient({ adapter });
// Injected into createApp(prisma) → forwarded to createUsersRouter(prisma)
```

---

## Database Schema

### User
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, auto |
| email | String | unique |
| name | String? | |
| passwordHash | String | bcrypt, SALT_ROUNDS=12 |
| createdAt | DateTime | auto |
| updatedAt | DateTime | auto |

### Session (stateful token)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, auto |
| userId | UUID | FK → users.id, CASCADE delete |
| token | UUID | unique, auto-generated — this is the auth token |
| createdAt | DateTime | auto |
| expiresAt | DateTime | now + SESSION_EXPIRY_HOURS |

```prisma
model Session {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique @default(uuid())
  createdAt DateTime @default(now()) @map("created_at")
  expiresAt DateTime @map("expires_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("sessions")
}
```

---

## API Contract

### POST /api/users/register
```
Input:  { email: string, password: string(min 8), name: string }
Output: { success: true, message, data: { id, email, name, created_at } }
Errors: 400 INVALID_INPUT, 409 USER_EMAIL_EXISTS
```

### POST /api/users/login
```
Input:  { email: string, password: string }
Output: { success: true, message, data: { id, email, name, token: uuid } }
Errors: 400 INVALID_INPUT, 401 INVALID_CREDENTIALS
```

---

## Environment Variables

| Var | Default | Purpose |
|-----|---------|---------|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `PORT` | 3000 | HTTP listen port |
| `SESSION_EXPIRY_HOURS` | 24 | Token lifetime in hours |

---

## Conventions

- **Strict TypeScript**: NO `any`. All interfaces in `types/users.types.ts`.
- **DRY**: ApiError, sendSuccess/sendError, Zod schemas, bcrypt — reuse, don't duplicate.
- **YAGNI**: No refresh token, no role/permission until needed.
- **Stateful sessions**: UUID token stored in DB → can be revoked/expired server-side.
- **Error codes**: `INVALID_INPUT`=400, `INVALID_CREDENTIALS`=401, `USER_EMAIL_EXISTS`=409, `DB_ERROR`=500.
- **Prisma migrations**: `npx prisma migrate dev --name <name>` then `npx prisma generate`.

