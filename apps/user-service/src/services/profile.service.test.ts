import assert from "node:assert/strict";
import test from "node:test";
import { ConflictError, NotFoundError } from "@shared/common";
import { ProfileService } from "./profile.service";

interface FakeUserInfo {
  id: string;
  userId: string;
  nickname: string;
  description: string;
  createdAt: Date;
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

function createFakePrisma(seed: FakeUserInfo[] = []) {
  const rows: FakeUserInfo[] = seed.map((r) => ({ ...r }));

  return {
    userInfo: {
      findUnique: async ({ where, select }: { where: Record<string, unknown>; select?: Record<string, unknown> }) => {
        let row: FakeUserInfo | null = null;
        if (where.userId !== undefined) {
          row = rows.find((r) => r.userId === where.userId) ?? null;
        } else if (where.nickname !== undefined) {
          row = rows.find((r) => r.nickname === where.nickname) ?? null;
        } else if (where.id !== undefined) {
          row = rows.find((r) => r.id === where.id) ?? null;
        }

        if (!row) return null;
        return pick(row, select);
      },
      create: async ({ data, select }: { data: Record<string, unknown>; select?: Record<string, unknown> }) => {
        const row = {
          id: "p" + (rows.length + 1),
          createdAt: new Date(),
          ...data,
        } as unknown as FakeUserInfo;
        rows.push(row);
        return pick(row, select);
      },
      update: async ({ where, data, select }: { where: { userId: string }; data: Record<string, unknown>; select?: Record<string, unknown> }) => {
        const row = rows.find((r) => r.userId === where.userId);
        if (!row) return null;
        Object.assign(row, data);
        return pick(row, select);
      },
    },
  };
}

function makeService(seed: FakeUserInfo[] = []) {
  const prisma = createFakePrisma(seed);
  return new ProfileService(prisma as never);
}

const seeded = (overrides: Partial<FakeUserInfo> = {}): FakeUserInfo => ({
  id: "p1",
  userId: "u1",
  nickname: "nick",
  description: "",
  createdAt: new Date(),
  ...overrides,
});

test("create returns the created profile", async () => {
  const service = makeService();
  const profile = await service.create("u1", "nick", "hello");

  assert.equal(profile.userId, "u1");
  assert.equal(profile.nickname, "nick");
  assert.equal(profile.description, "hello");
});

test("create rejects an existing profile", async () => {
  const service = makeService([seeded()]);

  await assert.rejects(service.create("u1", "another"), ConflictError);
});

test("create rejects a taken nickname", async () => {
  const service = makeService([seeded()]);

  await assert.rejects(service.create("u2", "nick"), ConflictError);
});

test("getByUserId returns the profile", async () => {
  const service = makeService([seeded()]);

  const profile = await service.getByUserId("u1");
  assert.equal(profile.nickname, "nick");
});

test("getByUserId throws when missing", async () => {
  const service = makeService();

  await assert.rejects(service.getByUserId("u1"), NotFoundError);
});

test("update changes the profile", async () => {
  const service = makeService([seeded()]);

  const profile = await service.update("u1", { description: "new bio" });
  assert.equal(profile.description, "new bio");
  assert.equal(profile.nickname, "nick");
});

test("update throws when missing", async () => {
  const service = makeService();

  await assert.rejects(service.update("u1", { description: "x" }), NotFoundError);
});

test("update rejects a nickname taken by another user", async () => {
  const service = makeService([
    seeded(),
    seeded({ id: "p2", userId: "u2", nickname: "nick2" }),
  ]);

  await assert.rejects(service.update("u1", { nickname: "nick2" }), ConflictError);
});
