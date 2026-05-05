import type { CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    catId: number;
}

export interface Cat {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Likes[];
}

export interface ResponseCatListDto {
  data: {
    data: Cat[];
    nextCursor: number;
    hasNext: boolean;
  };
}

export interface Author {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author: Author;
}

export interface ResponseCommentListDto {
    data: {
        data: Comment[];
        nextCursor: number;
        hasNext: boolean;
    };
}

export interface ResponseCommentDto {
    data: Comment;
}
    