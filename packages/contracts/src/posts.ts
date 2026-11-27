import {
  QUEUES,
  type RpcMessage,
  type ServicePingRequest,
  type ServicePingResponse,
} from './common.js';

export const POSTS_SERVICE = QUEUES.posts;

export const PostsPatterns = {
  Ping: 'posts.ping',
} as const;

export type PostsPattern =
  (typeof PostsPatterns)[keyof typeof PostsPatterns];

export interface PostsMessages {
  [PostsPatterns.Ping]: RpcMessage<ServicePingRequest, ServicePingResponse>;
}
