import assert from "node:assert/strict";
import test from "node:test";
import { UnauthorizedError } from "@shared/common";
import { AuthService } from "./auth.service";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("auth client returns the user id", async (t) => {
  let request: { url: string; authorization?: string } | undefined;

  t.mock.method(globalThis, "fetch", async (url: string | URL, init?: RequestInit) => {
    request = {
      url: String(url),
      authorization: (init?.headers as Record<string, string>).authorization,
    };
    return jsonResponse({ id: "u1" });
  });

  const userId = await new AuthService("http://auth:4001/").getUserId("token");

  assert.equal(userId, "u1");
  assert.equal(request?.url, "http://auth:4001/api/auth/me");
  assert.equal(request?.authorization, "Bearer token");
});

test("auth client rejects an invalid token", async (t) => {
  t.mock.method(globalThis, "fetch", async () => jsonResponse({}, 401));

  await assert.rejects(new AuthService("http://auth:4001").getUserId("token"), UnauthorizedError);
});

test("auth client rejects an unavailable auth service", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("network down");
  });

  await assert.rejects(new AuthService("http://auth:4001").getUserId("token"), UnauthorizedError);
});

