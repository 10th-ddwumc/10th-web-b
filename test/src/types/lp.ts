// src/types/lp.ts
export type SortType = "latest" | "oldest";
export type OrderType = "asc" | "desc";

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
    nextCursor: number | null;
    hasNext: boolean;
  };
};

export type LpDetailResponse = {
  data: Lp;
};

export type LpCommentAuthor = {
  id: number;
  name: string;
  avatar?: string;
};

export type LpComment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author?: LpCommentAuthor;
  user?: LpCommentAuthor;
};

export type LpCommentListResponse = {
  data: {
    data: LpComment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
};