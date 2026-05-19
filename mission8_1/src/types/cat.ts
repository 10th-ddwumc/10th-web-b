import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
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
  authorId: number;
  author?: Author;
}

export type ResponseCatListDto = CursorBasedResponse<Cat[]>;
export type ResponseCatDetailDto = CommonResponse<Cat>;

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

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;
export type ResponseCommentDto = CommonResponse<Comment>;
    