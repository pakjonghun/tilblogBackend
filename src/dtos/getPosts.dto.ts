import { IsNumber, IsOptional } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  term?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  sortKey?: string;

  @IsOptional()
  sortValue?: string;

  @IsNumber({}, { message: '페이지를 입력하세요' })
  page: number;

  @IsNumber({}, { message: 'perPage를 입력하세요' })
  perPage: number;
}
