import { Post } from './Interfaces';
export declare class CacheStore {
    private postPath;
    private fileList;
    private postList;
    private getFilesFromFile;
    private getPostsForm;
    private getPostByTerm;
    private getPosts;
    private getPostByCategory;
    private getPostsByAllOption;
    private getArrayCategory;
    getData({ term, sortKey, sortValue, category, }: {
        term?: string;
        category?: string;
        sortValue?: string;
        sortKey?: string;
    }): Post[];
    getTotalCount({ term, category }: {
        term?: string;
        category?: string;
    }): number;
}
