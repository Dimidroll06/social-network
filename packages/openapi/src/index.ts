export const openapiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Social Network API",
    version: "1.0.0",
    description: "Authentication, user profiles and social feed API.",
  },
  servers: [{ url: "/", description: "Current gateway" }],
  tags: [
    { name: "Auth", description: "Registration, authentication and sessions" },
    { name: "Profiles", description: "Public user profiles" },
    { name: "Feed", description: "Posts, likes and reposts" },
    { name: "Health", description: "Service health checks" },
  ],
  paths: {
    "/api/auth/health": {
      get: {
        tags: ["Health"],
        summary: "Check auth service health",
        operationId: "getAuthHealth",
        responses: { "200": { $ref: "#/components/responses/Health" } },
      },
    },
    "/api/user/health": {
      get: {
        tags: ["Health"],
        summary: "Check user service health",
        operationId: "getUserHealth",
        responses: { "200": { $ref: "#/components/responses/Health" } },
      },
    },
    "/api/feed/health": {
      get: {
        tags: ["Health"],
        summary: "Check feed service health",
        operationId: "getFeedHealth",
        responses: { "200": { $ref: "#/components/responses/Health" } },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        operationId: "register",
        requestBody: { $ref: "#/components/requestBodies/Credentials" },
        responses: {
          "201": { $ref: "#/components/responses/AuthTokens" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in a user",
        operationId: "login",
        requestBody: { $ref: "#/components/requestBodies/Credentials" },
        responses: {
          "200": { $ref: "#/components/responses/AuthTokens" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Rotate the refresh token",
        operationId: "refresh",
        security: [{ refreshCookie: [] }],
        responses: {
          "200": { $ref: "#/components/responses/AuthTokens" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out and revoke the refresh token",
        operationId: "logout",
        security: [{ refreshCookie: [] }],
        responses: { "204": { description: "Session ended" } },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the current user",
        operationId: "getCurrentUser",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/CurrentUser" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/user/profile": {
      post: {
        tags: ["Profiles"],
        summary: "Create the current user's profile",
        operationId: "createProfile",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CreateProfile" },
        responses: {
          "201": { $ref: "#/components/responses/Profile" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
      patch: {
        tags: ["Profiles"],
        summary: "Update the current user's profile",
        operationId: "updateProfile",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/UpdateProfile" },
        responses: {
          "200": { $ref: "#/components/responses/Profile" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/user/profile/me": {
      get: {
        tags: ["Profiles"],
        summary: "Get the current user's profile",
        operationId: "getCurrentProfile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Profile" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/feed/posts": {
      get: {
        tags: ["Feed"],
        summary: "Get the feed",
        operationId: "listPosts",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/Limit" },
          { $ref: "#/components/parameters/Offset" },
        ],
        responses: {
          "200": { $ref: "#/components/responses/PostList" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Feed"],
        summary: "Create a post",
        operationId: "createPost",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CreatePost" },
        responses: {
          "201": { $ref: "#/components/responses/Post" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/feed/posts/{id}": {
      parameters: [{ $ref: "#/components/parameters/PostId" }],
      get: {
        tags: ["Feed"],
        summary: "Get a post",
        operationId: "getPost",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Post" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Feed"],
        summary: "Delete the current user's post",
        operationId: "deletePost",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Post deleted" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/feed/posts/{id}/like": {
      parameters: [{ $ref: "#/components/parameters/PostId" }],
      post: {
        tags: ["Feed"],
        summary: "Like a post",
        operationId: "likePost",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Post liked" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Feed"],
        summary: "Remove a like",
        operationId: "unlikePost",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Like removed" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/feed/posts/{id}/repost": {
      parameters: [{ $ref: "#/components/parameters/PostId" }],
      post: {
        tags: ["Feed"],
        summary: "Repost a post",
        operationId: "repost",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Post reposted" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Feed"],
        summary: "Remove a repost",
        operationId: "unrepost",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Repost removed" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      refreshCookie: { type: "apiKey", in: "cookie", name: "refreshToken" },
    },
    parameters: {
      Limit: {
        name: "limit",
        in: "query",
        description: "Number of posts to return",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      Offset: {
        name: "offset",
        in: "query",
        description: "Number of posts to skip",
        schema: { type: "integer", minimum: 0, default: 0 },
      },
      PostId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
    },
    requestBodies: {
      Credentials: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Credentials" },
          },
        },
      },
      CreateProfile: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProfile" },
          },
        },
      },
      UpdateProfile: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProfile" },
          },
        },
      },
      CreatePost: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreatePost" },
          },
        },
      },
    },
    responses: {
      Health: {
        description: "Service is healthy",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Health" } } },
      },
      AuthTokens: {
        description: "Access token returned; refresh token is set as an HttpOnly cookie",
        headers: { "Set-Cookie": { schema: { type: "string" } } },
        content: { "application/json": { schema: { $ref: "#/components/schemas/AuthTokens" } } },
      },
      CurrentUser: {
        description: "Current user",
        content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
      },
      Profile: {
        description: "User profile",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Profile" } } },
      },
      Post: {
        description: "Feed post",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } },
      },
      PostList: {
        description: "Paginated feed",
        content: { "application/json": { schema: { $ref: "#/components/schemas/PostList" } } },
      },
      BadRequest: { description: "Request validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      Unauthorized: { description: "Authentication failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      Conflict: { description: "Resource conflict", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      NotFound: { description: "Resource not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
    },
    schemas: {
      Credentials: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", maxLength: 254 },
          password: { type: "string", minLength: 8, maxLength: 72, format: "password" },
        },
      },
      AuthTokens: {
        type: "object",
        required: ["accessToken"],
        properties: { accessToken: { type: "string" } },
      },
      User: {
        type: "object",
        required: ["id", "email"],
        properties: { id: { type: "string", format: "uuid" }, email: { type: "string", format: "email" } },
      },
      CreateProfile: {
        type: "object",
        required: ["nickname"],
        properties: {
          nickname: { type: "string", minLength: 3, maxLength: 30 },
          description: { type: "string", maxLength: 160, default: "" },
        },
      },
      UpdateProfile: {
        type: "object",
        minProperties: 1,
        properties: {
          nickname: { type: "string", minLength: 3, maxLength: 30 },
          description: { type: "string", maxLength: 160 },
        },
      },
      Profile: {
        type: "object",
        required: ["id", "userId", "nickname", "description", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          nickname: { type: "string" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreatePost: {
        type: "object",
        required: ["content"],
        properties: { content: { type: "string", minLength: 1, maxLength: 280 } },
      },
      Post: {
        type: "object",
        required: ["id", "authorId", "content", "createdAt", "updatedAt", "likesCount", "repostsCount", "likedByViewer", "repostedByViewer"],
        properties: {
          id: { type: "string", format: "uuid" },
          authorId: { type: "string", format: "uuid" },
          content: { type: "string", maxLength: 280 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          likesCount: { type: "integer", minimum: 0 },
          repostsCount: { type: "integer", minimum: 0 },
          likedByViewer: { type: "boolean" },
          repostedByViewer: { type: "boolean" },
        },
      },
      PostList: {
        type: "object",
        required: ["items", "limit", "offset"],
        properties: {
          items: { type: "array", items: { $ref: "#/components/schemas/Post" } },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      Health: {
        type: "object",
        required: ["service", "status", "timestamp"],
        properties: {
          service: { type: "string", enum: ["auth", "user", "feed"] },
          status: { type: "string", enum: ["ok"] },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["message"],
            properties: { message: { type: "string" }, code: { type: "string" }, details: {} },
          },
        },
      },
    },
  },
} as const;

