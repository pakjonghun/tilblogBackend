import { GetPostsDto } from './dtos/getPosts.dto';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getPosts(getPostQuery: GetPostsDto): {
        data: import("./Interfaces").Post[];
        totalCount: number;
    };
    getCategory(): unknown[];
    getTotalCount(): number;
    getDetail(id: string): import("./Interfaces").Post;
}
