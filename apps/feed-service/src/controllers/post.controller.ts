import type { Request, Response } from "express";
import type { PostService } from "../services/post.service";
import type { AuthedRequest } from "../types";

export class PostController {
  constructor(private readonly postService: PostService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body as { content: string };
    const post = await this.postService.create((req as AuthedRequest).userId, content);
    res.status(201).json(post);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.query as unknown as { limit: number; offset: number };
    const posts = await this.postService.list((req as AuthedRequest).userId, limit, offset);
    res.status(200).json({ items: posts, limit, offset });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const post = await this.postService.getById(
      (req as AuthedRequest).userId,
      id,
    );
    res.status(200).json(post);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.postService.remove((req as AuthedRequest).userId, req.params.id as string);
    res.status(204).send();
  };

  like = async (req: Request, res: Response): Promise<void> => {
    await this.postService.like((req as AuthedRequest).userId, req.params.id as string);
    res.status(204).send();
  };

  unlike = async (req: Request, res: Response): Promise<void> => {
    await this.postService.unlike((req as AuthedRequest).userId, req.params.id as string);
    res.status(204).send();
  };

  repost = async (req: Request, res: Response): Promise<void> => {
    await this.postService.repost((req as AuthedRequest).userId, req.params.id as string);
    res.status(204).send();
  };

  unrepost = async (req: Request, res: Response): Promise<void> => {
    await this.postService.unrepost((req as AuthedRequest).userId, req.params.id as string);
    res.status(204).send();
  };
}
