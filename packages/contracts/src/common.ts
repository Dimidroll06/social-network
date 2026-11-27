export interface RpcMessage<TRequest, TResponse> {
  request: TRequest;
  response: TResponse;
}

export type MessageContract = Record<string, RpcMessage<unknown, unknown>>;

export const QUEUES = {
  users: 'users-service',
  posts: 'posts-service',
  gateway: 'api-gateway',
} as const;

export interface ServicePingRequest {
  [key: string]: never;
}

export interface ServicePingResponse {
  service: string;
  status: 'ok';
  timestamp: string;
}
