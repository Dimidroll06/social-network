import { Router } from "express";
import { validateBody, validateParams, validateQuery } from "@shared/common";
import { config } from "../config";
import { PostController } from "../controllers/post.controller";
import { prisma } from "../lib/prisma";
import { createAuthenticateMiddleware } from "../middleware/auth.middleware";
import { createPostSchema, feedQuerySchema, postIdParamsSchema } from "../schemas/post.schema";
import { AuthService } from "../services/auth.service";
import { PostService } from "../services/post.service";

const postService = new PostService(prisma);
const postController = new PostController(postService);
const authenticate = createAuthenticateMiddleware(new AuthService(config.services.auth));

export const postRouter = Router();

postRouter.use(authenticate);
postRouter.get("/", validateQuery(feedQuerySchema), postController.list);
postRouter.post("/", validateBody(createPostSchema), postController.create);
postRouter.get("/:id", validateParams(postIdParamsSchema), postController.getById);
postRouter.delete("/:id", validateParams(postIdParamsSchema), postController.remove);
postRouter.post("/:id/like", validateParams(postIdParamsSchema), postController.like);
postRouter.delete("/:id/like", validateParams(postIdParamsSchema), postController.unlike);
postRouter.post("/:id/repost", validateParams(postIdParamsSchema), postController.repost);
postRouter.delete("/:id/repost", validateParams(postIdParamsSchema), postController.unrepost);

