import assert from "node:assert/strict";
import test from "node:test";
import { UnauthorizedError } from "@shared/common";
import { AuthService } from "./auth.service";

const baseUrl = "http://auth:4001";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("returns the user id on success", async (t) => {
  let captured: { url: string; headers: Record<string, string> } | undefined;

  t.mock.method(globalThis, "fetch", async (url: string | URL, init?: RequestInit) => {
    captured = {
      url: String(url),
      headers: (init?.headers ?? {}) as Record<string, string>,
    };
    return jsonResponse({ id: "u1", email: "a@b.c" });
  });

  const auth = new AuthService(baseUrl);
  const userId = await auth.getUserId("token");

  assert.equal(userId, "u1");
  assert.equal(captured?.url, baseUrl + "/api/auth/me");
  assert.equal(captured?.headers.authorization, "Bearer token");
});

test("throws UnauthorizedError on a 401 response", async (t) => {
  t.mock.method(globalThis, "fetch", async () => jsonResponse({}, 401));

  const auth = new AuthService(baseUrl);
  await assert.rejects(auth.getUserId("token"), UnauthorizedError);
});

test("throws UnauthorizedError on a network error", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("network down");
  });

  const auth = new AuthService(baseUrl);
  await assert.rejects(auth.getUserId("token"), UnauthorizedError);
});

test("throws UnauthorizedError when the response has no id", async (t) => {
  t.mock.method(globalThis, "fetch", async () => jsonResponse({ email: "a@b.c" }));

  const auth = new AuthService(baseUrl);
  await assert.rejects(auth.getUserId("token"), UnauthorizedError);
});
