export interface Post {
  id: string;
  head: { date: string; category: string };
  body: string;
}
[];

export interface PostHead {
  category: string;
  date: string;
}

export interface PostFileData {
  file: string;
  data: any;
  content: string;
}
