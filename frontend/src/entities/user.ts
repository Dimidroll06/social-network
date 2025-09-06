export type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type UpdateUserDto = {
  username: string;
};
