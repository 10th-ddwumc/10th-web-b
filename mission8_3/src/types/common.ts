import { PAGINATION_ORDER } from "../enums/common";

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export type CursorPaginationResult<T> = {
    data: T;
    nextCursor: number | null;
    hasNext: boolean;
}

export type CursorBasedResponse<T> = CommonResponse<CursorPaginationResult<T>>;

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER];
}