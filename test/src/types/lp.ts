// src/types/lp.ts
export type SortType = "latest" | "oldest";

export type LpTag = {
  id: number;
  name: string;
};

export type LpLike = {
  id: number;
  userId: number;
  lpId?: number;
};

export type LpAuthor = {
  id: number;
  name: string;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: LpTag[];
  likes?: LpLike[];
  author?: LpAuthor;
  authorId?: number;
};

export type LpListResponse = {
  data: {
    data: Lp[];
    nextCursor: number;
    hasNext: boolean;
  };
};

export type LpDetailResponse = {
  data: Lp;
};