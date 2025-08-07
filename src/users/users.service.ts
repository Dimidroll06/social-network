/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.entity';
import { GetUserDto } from './dto/user-get-dto';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { Repository } from 'typeorm';
import { PaginatedResult } from 'src/interfaces/paginated-result';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  readonly saltRounds = 10;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<GetUserDto>> {
    const { page, limit } = paginationQuery;

    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const result = data.map((user) => {
      const { password: _, ...userDto } = user;
      return userDto;
    });

    const totalPages = Math.ceil(total / limit);

    return {
      result,
      meta: {
        total,
        page,
        limit,
        pages: totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getUserById(id: number): Promise<GetUserDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (user === null) {
      return null;
    }

    const { password: _, ...result } = user;

    return result;
  }

  async getUserByEmail(email: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user === null) {
      return null;
    }

    const { password: _, ...result } = user;

    return result;
  }

  async createUser(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const { username, email, password } = createUserDto;

    const hash = await bcrypt.hash(password, this.saltRounds);

    const { password: _, ...result } = await this.userRepository.save({
      username,
      email,
      password: hash,
    });

    return result;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const { username } = updateUserDto;
    const result = await this.userRepository.save({
      id,
      username,
    });

    return result;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({
      id,
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<GetUserDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const { password: hash, ...result } = user;
    const isPasswordValid = await bcrypt.compare(password, hash);

    if (!isPasswordValid) {
      return null;
    }

    return result;
  }
}
