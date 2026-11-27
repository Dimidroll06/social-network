import {
  QUEUES,
  type RpcMessage,
  type ServicePingRequest,
  type ServicePingResponse,
  type ServiceReadinessResponse,
} from './common.js';

/** Nest DI token for the users-service client. */
export const USERS_SERVICE = QUEUES.users;

export const UsersPatterns = {
  Ping: 'users.ping',
  Readiness: 'users.readiness',
} as const;

export type UsersPattern =
  (typeof UsersPatterns)[keyof typeof UsersPatterns];

export interface UsersMessages {
  [UsersPatterns.Ping]: RpcMessage<ServicePingRequest, ServicePingResponse>;
  [UsersPatterns.Readiness]: RpcMessage<
    ServicePingRequest,
    ServiceReadinessResponse
  >;
}
