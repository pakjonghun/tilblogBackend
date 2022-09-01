import { GetPostsDto } from './dtos/getPosts.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPosts(@Query() getPostQuery: GetPostsDto) {
    return this.appService.getPosts(getPostQuery);
  }

  @Get('category')
  getCategory() {
    return this.appService.getCategory();
  }

  @Get('totalCount')
  getTotalCount() {
    return this.appService.getTotalCount();
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.appService.getPost(id);
  }
}
