import { GetPostsDto } from './dtos/getPosts.dto';
import { CacheStore } from './cache';
export declare class AppService {
    private readonly cacheStore;
    constructor(cacheStore: CacheStore);
    getPosts(getPostQuery: GetPostsDto): {
        data: import("./Interfaces").Post[];
        totalCount: number;
    };
    getPost(id: string): import("./Interfaces").Post;
    getCategory(): unknown[];
}
