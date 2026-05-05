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

export interface ResponseCatDetailDto {
  data: Cat;
}
    