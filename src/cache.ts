import { readdirSync, readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { Post, PostFileData, PostHead } from './Interfaces';
import { resolve } from 'path';
import * as matter from 'gray-matter';

@Injectable()
export class CacheStore {
  private postPath = resolve(__dirname, '..', 'til');
  private fileList: string[] = [];
  private postList: Record<string, Post[]> = {};

  private getFilesFromFile() {
    if (this.fileList.length) return this.fileList;
    else {
      const files = readdirSync(this.postPath).sort((a, b) => {
        if (a > b) return -1;
        else return 1;
      });

      this.fileList = files;
      return files;
    }
  }

  private getPostsForm({ file, data, content }: PostFileData) {
    const post: Post = {
      id: file,
      head: data as PostHead,
      body: content,
    };

    return post;
  }

  private getPostByTerm(term: string) {
    if (this.postList[term]) return this.postList[term];
    else {
      const files = this.getFilesFromFile();
      const posts: Post[] = [];
      for (const file of files) {
        const readFile = readFileSync(`${this.postPath}/${file}`);
        const { data, content } = matter(readFile);

        if (
          data.category?.includes(term) ||
          content?.includes(term) ||
          file?.includes(term)
        ) {
          const post = this.getPostsForm({ file, data, content });
          posts.push(post);
        }
      }
      this.postList[term] = posts;
      return posts;
    }
  }

  private getPosts() {
    if (this.postList?.raw) return this.postList.raw;
    else {
      const files = this.getFilesFromFile();
      const posts: Post[] = [];
      for (const file of files) {
        const readFile = readFileSync(`${this.postPath}/${file}`);
        const { data, content } = matter(readFile);
        const post = this.getPostsForm({ file, data, content });
        posts.push(post);
      }
      this.postList.raw = posts;
      return posts;
    }
  }

  private getPostByCategory(category: string) {
    const cateList = this.getArrayCategory(category);
    const posts = [...this.getPosts()];
    return posts.filter((p) => {
      if (!p.head.category) return false;
      const thisCate = this.getArrayCategory(p.head.category);
      return cateList.every((c) => thisCate.includes(c));
    });
  }

  private getPostsByAllOption({
    term,
    category,
  }: {
    term: string;
    category: string[];
  }) {
    const postListByTerm = this.getPostByTerm(term);
    return postListByTerm.filter((p) => {
      const thisCate = this.getArrayCategory(p.head.category);
      return category.every((c) => thisCate.includes(c));
    });
  }

  private getArrayCategory(category: string) {
    if (!category) return [];
    return category
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c);
  }

  getData({
    term,
    sortKey,
    sortValue,
    category,
  }: {
    term?: string;
    category?: string;
    sortValue?: string;
    sortKey?: string;
  }) {
    let posts: Post[] = [];
    if (!term && !category) posts = this.getPosts();
    if (term && !category) posts = this.getPostByTerm(term);
    if (!term && category) posts = this.getPostByCategory(category);
    if (term && category)
      posts = this.getPostsByAllOption({
        term,
        category: this.getArrayCategory(category),
      });

    if (sortKey && sortValue) {
      const isAsc = sortValue === 'desc';
      if (sortKey === 'title') {
        posts.sort((a, b) => {
          if (a.id > b.id) return isAsc ? -1 : 1;
          else return isAsc ? 1 : -1;
        });
      }

      if (sortKey === 'date') {
        posts.sort((a, b) => {
          if (a.head.date > b.head.date) return isAsc ? -1 : 1;
          else return isAsc ? 1 : -1;
        });
      }
    }
    return posts;
  }

  getTotalCount({ term, category }: { term?: string; category?: string }) {
    return this.getData({ term, category }).length;
  }
}
