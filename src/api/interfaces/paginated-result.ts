import { ApiProperty } from '@nestjs/swagger';

export interface PaginatedResult<T> {
  result: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
  };
}

class PaginatedResultMeta {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  pages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;
}
export class PaginatedResultDto<T> implements PaginatedResult<T> {
  @ApiProperty({ example: [] })
  result: T[];

  @ApiProperty()
  meta: PaginatedResultMeta;
}
