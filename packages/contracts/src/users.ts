import {
  QUEUES,
  type RpcMessage,
  type ServicePingRequest,
  type ServicePingResponse,
} from './common.js';

export const USERS_SERVICE = QUEUES.users;

export const UsersPatterns = {
  Ping: 'users.ping',
} as const;

export type UsersPattern =
  (typeof UsersPatterns)[keyof typeof UsersPatterns];

export interface UsersMessages {
  [UsersPatterns.Ping]: RpcMessage<ServicePingRequest, ServicePingResponse>;
}
