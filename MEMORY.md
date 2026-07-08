# Auth Project - Technical Lead Notes

**Project**: Authentication Service  
**Stack**: Express.js + TypeScript + Prisma + PostgreSQL  
**Repo**: git@github.com:rijalrf/auth-test.git

---

## TL Discipline & Workflow
- ✅ **Responsibility 1 — Planning**: Buat spec, dokumentasi, GitHub issues, architecture
- ✅ **Responsibility 2 — Code Review**: Review PR dari Dev dengan checklist ketat
- ❌ **Forbidden**: Implementasi code, schema changes, migrations, dependency installs
- 👉 **Action**: Delegate semua implementasi ke `@agenthermes_dev_bot` atau junior dev

---

## Code Review Checklist (KETAT)

### 1. Performance
- [ ] No unnecessary database queries (N+1 problem?)
- [ ] Efficient Prisma relations (select fields, avoid overfetch)
- [ ] No synchronous blocking operations (async/await pattern)
- [ ] Proper indexing hints in schema (if needed)
- [ ] Memory usage — no large object accumulation in loops

### 2. DRY (Don't Repeat Yourself) — STRICT
- [ ] No duplicate error handling code — use `ApiError` from utils
- [ ] No duplicate response formatting — use `sendSuccess/sendError` helpers
- [ ] No duplicate validation logic — use Zod schemas from schema folder
- [ ] No duplicate password hashing — reuse bcrypt from service layer
- [ ] No duplicate type definitions — all interfaces in `types/` folder
- [ ] No duplicate business logic — extract to service layer
- [ ] Constants reused, not hardcoded (SALT_ROUNDS, error messages, expiry hours)

### 3. YAGNI (You Aren't Gonna Need It)
- [ ] No speculative features (refresh tokens, permissions, etc. — add when needed)
- [ ] No "just in case" abstractions
- [ ] No unused imports or dead code
- [ ] No placeholder for future features without a ticket

### 4. Best Practice
- [ ] Prisma transactions for multi-step operations
- [ ] Proper error boundaries (catch specific errors, not generic)
- [ ] Input validation before processing (Zod safeParse)
- [ ] No raw SQL (use Prisma only)
- [ ] Proper async/await usage (no unhandled promises)
- [ ] Environment variables for config (no hardcoded secrets)

### 5. Naming Convention
- [ ] camelCase for variables, functions, properties
- [ ] PascalCase for classes, interfaces, types
- [ ] SCREAMING_SNAKE_CASE for constants
- [ ] Descriptive names (no `x`, `temp`, `data1`, `a`)
- [ ] Function names start with verb (create, get, validate, throw)
- [ ] Boolean variables start with `is`, `has`, `should`, `can`
- [ ] Avoid abbreviations except standard ones (req, res, err, db)

### 6. Flow & Folder Structure
- [ ] Code organized by responsibility (utils, schema, types, services, routes)
- [ ] No circular dependencies
- [ ] Related files grouped in same folder
- [ ] Clear file naming reflecting content (users.routes.ts, users.service.ts, etc.)
- [ ] Services isolated from routes (clean separation)
- [ ] Validation layer before service call
- [ ] Error handling at route level, business logic in service level

### 7. Clean Code (KETAT)
- [ ] No commented-out code
- [ ] No debug console.log left behind
- [ ] Single responsibility per function
- [ ] Functions under 20 lines (if longer, extract helpers)
- [ ] No nested ternaries or complex conditionals
- [ ] Early returns to reduce nesting
- [ ] Clear variable scope (const > let > var)
- [ ] No side effects in pure functions

### 8. Code Readability
- [ ] Self-documenting code (no vague variable names)
- [ ] Comments only for WHY, not WHAT
- [ ] JSDoc for exported functions (params, returns, throws)
- [ ] Consistent formatting and indentation
- [ ] Line length reasonable (max 100-120 chars)
- [ ] No magic numbers — use named constants
- [ ] Logical grouping of related statements
- [ ] Test code is as readable as production code

---

## TypeScript Strict Rules
- ✅ `strict: true` in tsconfig
- ❌ NO `any` type — always use proper interfaces/types
- ✅ All function parameters typed
- ✅ All return types explicitly declared
- ✅ No implicit `any`

---

## Established Patterns (Reuse, Don't Duplicate)
| Pattern | Location | DO NOT Duplicate |
|---------|----------|------------------|
| Error handling | `src/utils/errors.ts` (ApiError class) | Create new error classes |
| HTTP responses | `src/utils/response.ts` (sendSuccess/sendError) | Inline response formatting |
| Validation | `src/schema/users.validation.ts` (Zod) | Scattered validators |
| Password hashing | `src/services/users.service.ts` (bcrypt) | Hardcoded salts, new hash logic |
| Type safety | `src/types/users.types.ts` (interfaces) | Inline types, `any` type |
| Database access | Prisma client (auto-generated) | Manual SQL queries |
| Session queries | `src/repository/session.repository.ts` | Direct `prisma.session.*` calls |
