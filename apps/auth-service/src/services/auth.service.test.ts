import assert from "node:assert/strict";
import test from "node:test";
import { ConflictError, UnauthorizedError } from "@shared/common";
import { AuthService } from "./auth.service";
import type { PasswordHasher } from "./password.service";
import { TokenService } from "./token.service";

const jwtConfig = {
  accessSecret: "test-access-secret",
  refreshSecret: "test-refresh-secret",
  accessTtlSeconds: 15 * 60,
  refreshTtlSeconds: 60,
};

interface FakeUser {
  id: string;
  email: string;
  passwordHash: string;
  tokenVersion: number;
}

function pick<T extends object>(record: T, select?: Record<string, unknown>): Partial<T> {
  if (!select) return record;

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(select)) {
    if (select[key] && key in record) {
      result[key] = (record as Record<string, unknown>)[key];
    }
  }
  return result as Partial<T>;
}

function createFakePrisma(seed: FakeUser[] = []) {
  const users: FakeUser[] = seed.map((u) => ({ ...u }));

  return {
    user: {
      findUnique: async ({
        where,
        select,
      }: {
        where: Record<string, unknown>;
        select?: Record<string, unknown>;
      }) => {
        let user: FakeUser | null = null;
        if (where.email !== undefined) {
          user = users.find((u) => u.email === where.email) ?? null;
        } else if (where.id !== undefined) {
          user = users.find((u) => u.id === where.id) ?? null;
        }

        if (!user) return null;
        return pick(user, select);
      },
      create: async ({ data, select }: { data: Record<string, unknown>; select?: Record<string, unknown> }) => {
        const user = {
          id: "u" + (users.length + 1),
          tokenVersion: 0,
          ...data,
        } as unknown as FakeUser;
        users.push(user);
        return pick(user, select);
      },
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: { tokenVersion?: { increment: number } };
      }) => {
        const user = users.find((u) => u.id === where.id);
        if (!user) return null;
        if (data.tokenVersion?.increment) {
          user.tokenVersion += data.tokenVersion.increment;
        }
        return user;
      },
    },
  };
}

const fakeHasher: PasswordHasher = {
  hash: async (password) => "hashed:" + password,
  verify: async (password, hash) => hash === "hashed:" + password,
};

function makeService(seed: FakeUser[] = []) {
  const prisma = createFakePrisma(seed);
  const tokens = new TokenService(jwtConfig);
  return { service: new AuthService(prisma as never, tokens, fakeHasher), tokens };
}

test("register creates a user and returns tokens", async () => {
  const { service, tokens } = makeService();
  const result = await service.register("a@b.c", "password123");

  assert.ok(result.accessToken);
  assert.ok(result.refreshToken);

  const refresh = tokens.verifyRefreshToken(result.refreshToken);
  assert.equal(refresh.ver, 0);
});

test("register rejects a duplicate email", async () => {
  const { service } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "x", tokenVersion: 0 },
  ]);

  await assert.rejects(service.register("a@b.c", "password123"), ConflictError);
});

test("login returns tokens for valid credentials", async () => {
  const { service } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "hashed:password123", tokenVersion: 0 },
  ]);

  const result = await service.login("a@b.c", "password123");

  assert.ok(result.accessToken);
  assert.ok(result.refreshToken);
});

test("login rejects an unknown email", async () => {
  const { service } = makeService();

  await assert.rejects(service.login("nope@b.c", "password123"), UnauthorizedError);
});

test("login rejects a wrong password", async () => {
  const { service } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "hashed:right", tokenVersion: 0 },
  ]);

  await assert.rejects(service.login("a@b.c", "wrong"), UnauthorizedError);
});

test("refresh rotates tokens and invalidates the old refresh token", async () => {
  const { service, tokens } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "x", tokenVersion: 0 },
  ]);

  const first = tokens.signRefreshToken("u1", 0);
  const rotated = await service.refresh(first);

  assert.ok(rotated.accessToken);
  const next = tokens.verifyRefreshToken(rotated.refreshToken);
  assert.equal(next.ver, 1);

  // The previous refresh token is now invalid.
  await assert.rejects(service.refresh(first), UnauthorizedError);
});

test("refresh rejects an invalid token", async () => {
  const { service } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "x", tokenVersion: 0 },
  ]);

  await assert.rejects(service.refresh("garbage"), UnauthorizedError);
});

test("logout invalidates the refresh token", async () => {
  const { service, tokens } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "x", tokenVersion: 0 },
  ]);

  const refresh = tokens.signRefreshToken("u1", 0);
  await service.logout(refresh);

  await assert.rejects(service.refresh(refresh), UnauthorizedError);
});

test("getMe returns id and email", async () => {
  const { service } = makeService([
    { id: "u1", email: "a@b.c", passwordHash: "x", tokenVersion: 0 },
  ]);

  const user = await service.getMe("u1");
  assert.deepEqual(user, { id: "u1", email: "a@b.c" });
});
