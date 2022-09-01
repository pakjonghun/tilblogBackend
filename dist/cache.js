"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStore = void 0;
const fs_1 = require("fs");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const matter = require("gray-matter");
let CacheStore = class CacheStore {
    constructor() {
        this.postPath = (0, path_1.resolve)(__dirname, '..', '..', 'til');
        this.fileList = [];
        this.postList = {};
    }
    getFilesFromFile() {
        if (this.fileList.length)
            return this.fileList;
        else {
            const files = (0, fs_1.readdirSync)(this.postPath).sort((a, b) => {
                if (a > b)
                    return -1;
                else
                    return 1;
            });
            this.fileList = files;
            return files;
        }
    }
    getPostsForm({ file, data, content }) {
        const post = {
            id: file,
            head: data,
            body: content,
        };
        return post;
    }
    getPostByTerm(term) {
        var _a;
        if (this.postList[term])
            return this.postList[term];
        else {
            const files = this.getFilesFromFile();
            const posts = [];
            for (const file of files) {
                const readFile = (0, fs_1.readFileSync)(`${this.postPath}/${file}`);
                const { data, content } = matter(readFile);
                if (((_a = data.category) === null || _a === void 0 ? void 0 : _a.includes(term)) ||
                    (content === null || content === void 0 ? void 0 : content.includes(term)) ||
                    (file === null || file === void 0 ? void 0 : file.includes(term))) {
                    const post = this.getPostsForm({ file, data, content });
                    posts.push(post);
                }
            }
            this.postList[term] = posts;
            return posts;
        }
    }
    getPosts() {
        var _a;
        if ((_a = this.postList) === null || _a === void 0 ? void 0 : _a.raw)
            return this.postList.raw;
        else {
            const files = this.getFilesFromFile();
            const posts = [];
            for (const file of files) {
                const readFile = (0, fs_1.readFileSync)(`${this.postPath}/${file}`);
                const { data, content } = matter(readFile);
                const post = this.getPostsForm({ file, data, content });
                posts.push(post);
            }
            this.postList.raw = posts;
            return posts;
        }
    }
    getPostByCategory(category) {
        const cateList = this.getArrayCategory(category);
        const posts = [...this.getPosts()];
        return posts.filter((p) => {
            if (!p.head.category)
                return false;
            const thisCate = this.getArrayCategory(p.head.category);
            return cateList.every((c) => thisCate.includes(c));
        });
    }
    getPostsByAllOption({ term, category, }) {
        const postListByTerm = this.getPostByTerm(term);
        return postListByTerm.filter((p) => {
            const thisCate = this.getArrayCategory(p.head.category);
            return category.every((c) => thisCate.includes(c));
        });
    }
    getArrayCategory(category) {
        if (!category)
            return [];
        return category
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c);
    }
    getData({ term, sortKey, sortValue, category, }) {
        let posts = [];
        if (!term && !category)
            posts = this.getPosts();
        if (term && !category)
            posts = this.getPostByTerm(term);
        if (!term && category)
            posts = this.getPostByCategory(category);
        if (term && category)
            posts = this.getPostsByAllOption({
                term,
                category: this.getArrayCategory(category),
            });
        if (sortKey && sortValue) {
            const isAsc = sortValue === 'desc';
            if (sortKey === 'title') {
                posts.sort((a, b) => {
                    if (a.id > b.id)
                        return isAsc ? -1 : 1;
                    else
                        return isAsc ? 1 : -1;
                });
            }
            if (sortKey === 'date') {
                posts.sort((a, b) => {
                    if (a.head.date > b.head.date)
                        return isAsc ? -1 : 1;
                    else
                        return isAsc ? 1 : -1;
                });
            }
        }
        return posts;
    }
    getTotalCount({ term, category }) {
        return this.getData({ term, category }).length;
    }
};
CacheStore = __decorate([
    (0, common_1.Injectable)()
], CacheStore);
exports.CacheStore = CacheStore;
//# sourceMappingURL=cache.js.map