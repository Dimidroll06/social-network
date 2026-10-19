import { NotFoundError } from "@shared/common";
import type { PrismaClient } from "../generated/prisma-client";

export interface PostView {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  repostsCount: number;
  likedByViewer: boolean;
  repostedByViewer: boolean;
}

const postSelect = {
  id: true,
  authorId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { likes: true, reposts: true } },
} as const;

type SelectedPost = {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { likes: number; reposts: number };
};

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(authorId: string, content: string): Promise<PostView> {
    const post = await this.prisma.post.create({
      data: { authorId, content },
      select: postSelect,
    });

    return this.toView(post);
  }

  async list(viewerId: string, limit: number, offset: number): Promise<PostView[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: offset,
      take: limit,
      select: postSelect,
    });

    return this.withViewerState(posts, viewerId);
  }

  async getById(viewerId: string, id: string): Promise<PostView> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: postSelect,
    });

    if (!post) throw new NotFoundError("Post not found");
    return (await this.withViewerState([post], viewerId))[0];
  }

  async remove(userId: string, id: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) throw new NotFoundError("Post not found");
    if (post.authorId !== userId) throw new NotFoundError("Post not found");

    await this.prisma.post.delete({ where: { id } });
  }

  async like(userId: string, postId: string): Promise<void> {
    await this.ensurePost(postId);
    await this.prisma.like.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
  }

  async unlike(userId: string, postId: string): Promise<void> {
    await this.ensurePost(postId);
    await this.prisma.like.deleteMany({ where: { userId, postId } });
  }

  async repost(userId: string, postId: string): Promise<void> {
    await this.ensurePost(postId);
    await this.prisma.repost.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
  }

  async unrepost(userId: string, postId: string): Promise<void> {
    await this.ensurePost(postId);
    await this.prisma.repost.deleteMany({ where: { userId, postId } });
  }

  private async ensurePost(id: string): Promise<void> {
    const post = await this.prisma.post.findUnique({ where: { id }, select: { id: true } });
    if (!post) throw new NotFoundError("Post not found");
  }

  private async withViewerState(
    posts: SelectedPost[],
    viewerId: string,
  ): Promise<PostView[]> {
    if (posts.length === 0) return [];
    const postIds = posts.map((post) => post.id);
    const [likes, reposts] = await Promise.all([
      this.prisma.like.findMany({ where: { userId: viewerId, postId: { in: postIds } }, select: { postId: true } }),
      this.prisma.repost.findMany({ where: { userId: viewerId, postId: { in: postIds } }, select: { postId: true } }),
    ]);
    const likedIds = new Set(likes.map((item) => item.postId));
    const repostedIds = new Set(reposts.map((item) => item.postId));

    return posts.map((post) => this.toView(post, likedIds.has(post.id), repostedIds.has(post.id)));
  }

  private toView(
    post: SelectedPost,
    likedByViewer = false,
    repostedByViewer = false,
  ): PostView {
    return {
      id: post.id,
      authorId: post.authorId,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post._count.likes,
      repostsCount: post._count.reposts,
      likedByViewer,
      repostedByViewer,
    };
  }
}
