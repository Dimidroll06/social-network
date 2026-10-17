import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "@shared/common";
import { TokenService } from "./token.service";

const jwtConfig = {
  accessSecret: "test-access-secret",
  refreshSecret: "test-refresh-secret",
  accessTtlSeconds: 15 * 60,
  refreshTtlSeconds: 60,
};

const tokens = new TokenService(jwtConfig);

test("signs and verifies an access token", () => {
  const token = tokens.signAccessToken("user-1");
  const payload = tokens.verifyAccessToken(token);

  assert.equal(payload.sub, "user-1");
  assert.equal(payload.type, "access");
});

test("signs and verifies a refresh token", () => {
  const token = tokens.signRefreshToken("user-1", 3);
  const payload = tokens.verifyRefreshToken(token);

  assert.equal(payload.sub, "user-1");
  assert.equal(payload.type, "refresh");
  assert.equal(payload.ver, 3);
});

test("rejects a refresh token with the wrong type claim", () => {
  const token = jwt.sign(
    { sub: "user-1", type: "access" },
    jwtConfig.refreshSecret,
    { expiresIn: 60 },
  );

  assert.throws(() => tokens.verifyRefreshToken(token), UnauthorizedError);
});

test("rejects a refresh token without a version", () => {
  const token = jwt.sign(
    { sub: "user-1", type: "refresh" },
    jwtConfig.refreshSecret,
    { expiresIn: 60 },
  );

  assert.throws(() => tokens.verifyRefreshToken(token), UnauthorizedError);
});

test("rejects a token signed with a different secret", () => {
  const other = new TokenService({ ...jwtConfig, refreshSecret: "other-secret" });
  const token = other.signRefreshToken("user-1", 0);

  assert.throws(() => tokens.verifyRefreshToken(token), UnauthorizedError);
});

test("rejects garbage", () => {
  assert.throws(() => tokens.verifyRefreshToken("not-a-jwt"), UnauthorizedError);
});

test("rejects an expired token", async () => {
  const short = new TokenService({ ...jwtConfig, accessTtlSeconds: 1 });
  const token = short.signAccessToken("user-1");

  await new Promise((resolve) => setTimeout(resolve, 1100));

  assert.throws(() => short.verifyAccessToken(token), UnauthorizedError);
});
