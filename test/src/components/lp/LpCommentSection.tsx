// src/components/lp/LpCommentSection.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLpComment,
  deleteLpComment,
  updateLpComment,
} from "../../api/lp";
import { useInfiniteLpComments } from "../../hooks/useInfiniteLpComments";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { getUserId, getUserName } from "../../utils/token";
import type { LpComment, OrderType } from "../../types/lp";
import CommentSkeleton from "./CommentSkeleton";

type LpCommentSectionProps = {
  lpid: string;
};

const getAuthor = (comment: LpComment) => comment.author ?? comment.user;

const LpCommentSection = ({ lpid }: LpCommentSectionProps) => {
  const queryClient = useQueryClient();
  const myUserId = getUserId();
  const myUserName = getUserName();

  const [order, setOrder] = useState<OrderType>("desc");
  const [commentValue, setCommentValue] = useState("");
  const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

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

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createLpComment({
        lpid,
        content: commentValue.trim(),
      }),
    onSuccess: () => {
      setCommentValue("");
      invalidateComments();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) =>
      updateLpComment({
        lpid,
        commentId,
        content,
      }),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingValue("");
      invalidateComments();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteLpComment({ lpid, commentId }),
    onSuccess: () => {
      setOpenedMenuId(null);
      invalidateComments();
    },
  });

  const observerRef = useIntersectionObserver({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: () => fetchNextPage(),
  });

  const handleCreateComment = () => {
    if (!commentValue.trim()) return;
    createMutation.mutate();
  };

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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleCreateComment();
            }
          }}
          placeholder="댓글을 입력해주세요"
        />
        <button
          type="button"
          className={commentValue.trim().length > 0 ? "active" : ""}
          disabled={commentValue.trim().length === 0 || createMutation.isPending}
          onClick={handleCreateComment}
        >
          작성
        </button>
      </div>

      {commentValue.trim().length === 0 && (
        <p className="comment-help-text">
          댓글 내용을 입력하면 작성 버튼이 활성화됩니다.
        </p>
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
          {comments.map((comment) => {
            const author = getAuthor(comment);
            const authorName = author?.name ?? "익명";

            const isMine =
              author?.id === myUserId ||
              authorName === myUserName ||
              comment.user?.id === myUserId ||
              comment.author?.id === myUserId;

            const isEditing = editingCommentId === comment.id;

            return (
              <article key={comment.id} className="comment-item">
                <div className="comment-avatar">{authorName.slice(0, 1)}</div>

                <div className="comment-content">
                  <div className="comment-top">
                    <strong>{authorName}</strong>

                    {isMine && (
                      <div className="comment-menu-wrapper">
                        <button
                          type="button"
                          className="comment-more-button"
                          onClick={() =>
                            setOpenedMenuId((prev) =>
                              prev === comment.id ? null : comment.id
                            )
                          }
                        >
                          ⋮
                        </button>

                        {openedMenuId === comment.id && (
                          <div className="comment-menu">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingValue(comment.content);
                                setOpenedMenuId(null);
                              }}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("댓글을 삭제하시겠습니까?")) {
                                  deleteMutation.mutate(comment.id);
                                }
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="comment-edit-row">
                      <input
                        value={editingValue}
                        onChange={(event) => setEditingValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();

                            if (!editingValue.trim()) return;

                            updateMutation.mutate({
                              commentId: comment.id,
                              content: editingValue.trim(),
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={editingValue.trim().length === 0}
                        onClick={() =>
                          updateMutation.mutate({
                            commentId: comment.id,
                            content: editingValue.trim(),
                          })
                        }
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>
              </article>
            );
          })}

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