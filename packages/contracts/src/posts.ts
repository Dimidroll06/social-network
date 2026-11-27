import {
  QUEUES,
  type RpcMessage,
  type ServicePingRequest,
  type ServicePingResponse,
  type ServiceReadinessResponse,
} from './common.js';

/** Nest DI token for the posts-service client. */
export const POSTS_SERVICE = QUEUES.posts;

export const PostsPatterns = {
  Ping: 'posts.ping',
  Readiness: 'posts.readiness',
} as const;

export type PostsPattern =
  (typeof PostsPatterns)[keyof typeof PostsPatterns];

export interface PostsMessages {
  [PostsPatterns.Ping]: RpcMessage<ServicePingRequest, ServicePingResponse>;
  [PostsPatterns.Readiness]: RpcMessage<
    ServicePingRequest,
    ServiceReadinessResponse
  >;
}
