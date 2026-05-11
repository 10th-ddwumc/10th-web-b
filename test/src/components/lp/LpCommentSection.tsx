// src/components/lp/LpCommentSection.tsx
import { useState } from "react";
import { useInfiniteLpComments } from "../../hooks/useInfiniteLpComments";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import type { LpComment, OrderType } from "../../types/lp";
import CommentSkeleton from "./CommentSkeleton";

type LpCommentSectionProps = {
  lpid: string;
};

const getAuthorName = (comment: LpComment) => {
  return comment.author?.name ?? comment.user?.name ?? "익명";
};

const LpCommentSection = ({ lpid }: LpCommentSectionProps) => {
  const [order, setOrder] = useState<OrderType>("desc");
  const [commentValue, setCommentValue] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteLpComments(lpid, order);

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];

  const observerRef = useIntersectionObserver({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: () => {
      fetchNextPage();
    },
  });

  return (
    <section className="comment-section">
      <div className="comment-header">
        <h2>댓글</h2>

        <div className="comment-sort-buttons">
          <button
            type="button"
            className={order === "asc" ? "active" : ""}
            onClick={() => setOrder("asc")}
          >
            오래된순
          </button>
          <button
            type="button"
            className={order === "desc" ? "active" : ""}
            onClick={() => setOrder("desc")}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="comment-input-row">
        <input
          value={commentValue}
          onChange={(event) => setCommentValue(event.target.value)}
          placeholder="댓글을 입력해주세요"
        />
        <button type="button" disabled={commentValue.trim().length === 0}>
          작성
        </button>
      </div>

      {commentValue.trim().length === 0 && (
        <p className="comment-help-text">댓글 내용을 입력하면 작성 버튼이 활성화됩니다.</p>
      )}

      {isLoading && (
        <div className="comment-list">
          {Array.from({ length: 8 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="comment-error">
          <p>댓글을 불러오지 못했어요.</p>
          <button type="button" onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="comment-list">
          {comments.map((comment) => (
            <article key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {getAuthorName(comment).slice(0, 1)}
              </div>

              <div className="comment-content">
                <div className="comment-top">
                  <strong>{getAuthorName(comment)}</strong>
                  <button type="button">⋮</button>
                </div>
                <p>{comment.content}</p>
              </div>
            </article>
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 6 }).map((_, index) => (
              <CommentSkeleton key={`next-${index}`} />
            ))}

          <div ref={observerRef} className="infinite-trigger" />
        </div>
      )}
    </section>
  );
};

export default LpCommentSection;