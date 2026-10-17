import type { Request, Response } from "express";
import type { ProfileService } from "../services/profile.service";
import type { AuthedRequest } from "../types";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { nickname, description } = req.body as {
      nickname: string;
      description?: string;
    };
    const profile = await this.profileService.create(
      (req as AuthedRequest).userId,
      nickname,
      description ?? "",
    );

    res.status(201).json(profile);
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const profile = await this.profileService.getByUserId(
      (req as AuthedRequest).userId,
    );

    res.status(200).json(profile);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const data = req.body as { nickname?: string; description?: string };
    const profile = await this.profileService.update(
      (req as AuthedRequest).userId,
      data,
    );

    res.status(200).json(profile);
  };
}
