import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPostsDto } from './dtos/getPosts.dto';
import { CacheStore } from './cache';

@Injectable()
export class AppService {
  constructor(private readonly cacheStore: CacheStore) {}

  getPosts(getPostQuery: GetPostsDto) {
    const { category, term, page, perPage, sortKey, sortValue } = getPostQuery;
    const posts = this.cacheStore.getData({
      category,
      term,
      sortKey,
      sortValue,
    });
    const skip = (page - 1) * perPage;
    const data = posts.slice(skip, skip + perPage);
    const totalCount = this.cacheStore.getTotalCount({ category, term });

    return { data, totalCount };
  }

  getPost(id: string) {
    const posts = this.cacheStore.getData({ term: '', category: '' });
    const post = posts.find((post) => post.id === id);
    if (!post) throw new NotFoundException('포스트가 존재하지 않습니다.');
    return post;
  }

  getCategory() {
    const posts = this.cacheStore.getData({ term: '', category: '' });
    const set = new Set();
    posts.forEach((post) => {
      if (post?.head?.category) {
        post.head.category.split(',').forEach((c) => {
          const cate = c.trim();
          if (cate) set.add(cate);
        });
      }
    });

    return Array.from(set);
  }

  getTotalCount() {
    return this.cacheStore.getTotalCount({ category: '', term: '' });
  }
}
