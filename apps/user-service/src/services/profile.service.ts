import { ConflictError, NotFoundError } from "@shared/common";
import type { PrismaClient } from "../generated/prisma-client";

export interface ProfileView {
  id: string;
  userId: string;
  nickname: string;
  description: string;
  createdAt: Date;
}

const profileSelect = {
  id: true,
  userId: true,
  nickname: true,
  description: true,
  createdAt: true,
} as const;

export class ProfileService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, nickname: string, description = ""): Promise<ProfileView> {
    const existing = await this.prisma.userInfo.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictError("Profile already exists");
    }

    const takenNickname = await this.prisma.userInfo.findUnique({
      where: { nickname },
      select: { id: true },
    });

    if (takenNickname) {
      throw new ConflictError("Nickname is already taken");
    }

    return this.prisma.userInfo.create({
      data: { userId, nickname, description },
      select: profileSelect,
    });
  }

  async getByUserId(userId: string): Promise<ProfileView> {
    const profile = await this.prisma.userInfo.findUnique({
      where: { userId },
      select: profileSelect,
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    return profile;
  }

  async update(
    userId: string,
    data: { nickname?: string; description?: string },
  ): Promise<ProfileView> {
    const profile = await this.prisma.userInfo.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    if (data.nickname !== undefined) {
      const takenNickname = await this.prisma.userInfo.findUnique({
        where: { nickname: data.nickname },
        select: { id: true },
      });

      if (takenNickname && takenNickname.id !== profile.id) {
        throw new ConflictError("Nickname is already taken");
      }
    }

    return this.prisma.userInfo.update({
      where: { userId },
      data,
      select: profileSelect,
    });
  }
}
