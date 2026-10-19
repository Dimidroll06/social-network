import assert from "node:assert/strict";
import test from "node:test";
import { NotFoundError } from "@shared/common";
import { PostService } from "./post.service";

interface FakePost {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FakeReaction {
  userId: string;
  postId: string;
}

function createFakePrisma(seed: FakePost[] = [], likes: FakeReaction[] = [], reposts: FakeReaction[] = []) {
  const posts = seed.map((post) => ({ ...post }));
  const postLikes = likes.map((like) => ({ ...like }));
  const postReposts = reposts.map((repost) => ({ ...repost }));

  const selected = (post: FakePost) => ({
    ...post,
    _count: {
      likes: postLikes.filter((like) => like.postId === post.id).length,
      reposts: postReposts.filter((repost) => repost.postId === post.id).length,
    },
  });

  return {
    post: {
      create: async ({ data }: { data: { authorId: string; content: string } }) => {
        const now = new Date();
        const post = {
          id: `post-${posts.length + 1}`,
          ...data,
          createdAt: now,
          updatedAt: now,
        };
        posts.push(post);
        return selected(post);
      },
      findMany: async ({ skip, take }: { skip: number; take: number }) =>
        posts
          .slice()
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(skip, skip + take)
          .map(selected),
      findUnique: async ({ where }: { where: { id: string } }) => {
        const post = posts.find((item) => item.id === where.id);
        return post ? selected(post) : null;
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const index = posts.findIndex((post) => post.id === where.id);
        posts.splice(index, 1);
      },
    },
    like: {
      findMany: async ({ where }: { where: { userId: string; postId: { in: string[] } } }) =>
        postLikes.filter(
          (like) => like.userId === where.userId && where.postId.in.includes(like.postId),
        ),
      upsert: async ({ where, create }: { where: { userId_postId: FakeReaction }; create: FakeReaction }) => {
        const exists = postLikes.some(
          (like) => like.userId === where.userId_postId.userId && like.postId === where.userId_postId.postId,
        );
        if (!exists) postLikes.push({ ...create });
      },
      deleteMany: async ({ where }: { where: FakeReaction }) => {
        for (let index = postLikes.length - 1; index >= 0; index -= 1) {
          if (postLikes[index].userId === where.userId && postLikes[index].postId === where.postId) {
            postLikes.splice(index, 1);
          }
        }
      },
    },
    repost: {
      findMany: async ({ where }: { where: { userId: string; postId: { in: string[] } } }) =>
        postReposts.filter(
          (repost) => repost.userId === where.userId && where.postId.in.includes(repost.postId),
        ),
      upsert: async ({ where, create }: { where: { userId_postId: FakeReaction }; create: FakeReaction }) => {
        const exists = postReposts.some(
          (repost) =>
            repost.userId === where.userId_postId.userId && repost.postId === where.userId_postId.postId,
        );
        if (!exists) postReposts.push({ ...create });
      },
      deleteMany: async ({ where }: { where: FakeReaction }) => {
        for (let index = postReposts.length - 1; index >= 0; index -= 1) {
          if (postReposts[index].userId === where.userId && postReposts[index].postId === where.postId) {
            postReposts.splice(index, 1);
          }
        }
      },
    },
  };
}

const seeded = (overrides: Partial<FakePost> = {}): FakePost => {
  const createdAt = overrides.createdAt ?? new Date();
  return {
    id: "post-1",
    authorId: "u1",
    content: "hello",
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
};

function makeService(
  posts: FakePost[] = [],
  likes: FakeReaction[] = [],
  reposts: FakeReaction[] = [],
) {
  return new PostService(createFakePrisma(posts, likes, reposts) as never);
}

test("create returns a post with empty reaction state", async () => {
  const post = await makeService().create("u1", "hello");

  assert.equal(post.authorId, "u1");
  assert.equal(post.content, "hello");
  assert.equal(post.likesCount, 0);
  assert.equal(post.repostedByViewer, false);
});

test("list returns posts with counts and viewer reaction flags", async () => {
  const service = makeService(
    [seeded()],
    [{ userId: "u2", postId: "post-1" }],
    [{ userId: "u2", postId: "post-1" }],
  );

  const [post] = await service.list("u2", 20, 0);

  assert.equal(post.likesCount, 1);
  assert.equal(post.repostsCount, 1);
  assert.equal(post.likedByViewer, true);
  assert.equal(post.repostedByViewer, true);
});

test("getById throws when the post does not exist", async () => {
  await assert.rejects(makeService().getById("u1", "missing"), NotFoundError);
});

test("like and repost are idempotent and can be removed", async () => {
  const service = makeService([seeded()]);

  await service.like("u2", "post-1");
  await service.like("u2", "post-1");
  await service.repost("u2", "post-1");
  await service.repost("u2", "post-1");

  let [post] = await service.list("u2", 20, 0);
  assert.equal(post.likesCount, 1);
  assert.equal(post.repostsCount, 1);

  await service.unlike("u2", "post-1");
  await service.unrepost("u2", "post-1");
  [post] = await service.list("u2", 20, 0);
  assert.equal(post.likesCount, 0);
  assert.equal(post.repostsCount, 0);
});

test("only the author can delete a post", async () => {
  const service = makeService([seeded()]);

  await assert.rejects(service.remove("u2", "post-1"), NotFoundError);
  await service.remove("u1", "post-1");
  await assert.rejects(service.getById("u1", "post-1"), NotFoundError);
});

test("reactions fail for a missing post", async () => {
  const service = makeService();

  await assert.rejects(service.like("u1", "missing"), NotFoundError);
  await assert.rejects(service.repost("u1", "missing"), NotFoundError);
});

