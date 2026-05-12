// src/pages/LpDetailPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp, likeLp, unlikeLp } from "../api/lp";
import LoadingError from "../components/common/LoadingError";
import LpCommentSection from "../components/lp/LpCommentSection";
import LpEditorModal from "../components/lp/LpEditorModal";
import { useLpDetail } from "../hooks/useLpDetail";
import { getUserId } from "../utils/token";
import type { LpDetailResponse, LpLike } from "../types/lp";
import "../styles/LpPage.css";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useLpDetail(lpid);

  const lp = data?.data;
  const myUserId = getUserId();

  const isLiked =
    !!myUserId && !!lp?.likes?.some((like) => like.userId === myUserId);

  const likeMutation = useMutation({
    mutationFn: () => {
      if (!lpid) {
        throw new Error("LP ID가 없습니다.");
      }

      return isLiked ? unlikeLp(lpid) : likeLp(lpid);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpid] });

      const previousLp = queryClient.getQueryData<LpDetailResponse>([
        "lp",
        lpid,
      ]);

      queryClient.setQueryData<LpDetailResponse>(["lp", lpid], (oldData) => {
        if (!oldData?.data) return oldData;

        const currentLikes = oldData.data.likes ?? [];
        const alreadyLiked = currentLikes.some(
          (like: LpLike) => like.userId === myUserId
        );

        const nextLikes = alreadyLiked
          ? currentLikes.filter((like: LpLike) => like.userId !== myUserId)
          : [
              ...currentLikes,
              {
                id: Date.now(),
                userId: myUserId ?? -1,
                lpId: Number(lpid),
              },
            ];

        return {
          ...oldData,
          data: {
            ...oldData.data,
            likes: nextLikes,
          },
        };
      });

      return { previousLp };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(["lp", lpid], context.previousLp);
      }

      alert("좋아요 처리에 실패했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
      queryClient.invalidateQueries({ queryKey: ["lps"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lpid!),
    onSuccess: () => {
      alert("삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <section className="lp-detail-page">
        <div className="lp-detail-card detail-skeleton" />
      </section>
    );
  }

  if (isError || !lp || !lpid) {
    return <LoadingError onRetry={() => refetch()} />;
  }

  return (
    <section className="lp-detail-page">
      <article className="lp-detail-card">
        <div className="detail-top">
          <div className="author-box">
            <div className="author-avatar">💿</div>
            <strong>{lp.author?.name ?? "알 수 없음"}</strong>
          </div>

          <span className="detail-date">
            {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>

        <div className="detail-title-row">
          <h1>{lp.title}</h1>

          <div className="detail-actions">
            <button type="button" onClick={() => setIsEditModalOpen(true)}>
              ✎
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("정말 삭제하시겠습니까?")) {
                  deleteMutation.mutate();
                }
              }}
            >
              🗑
            </button>
          </div>
        </div>

        <div className="lp-disc-wrapper">
          <img src={lp.thumbnail} alt={lp.title} className="lp-disc-image" />
          <div className="lp-disc-hole" />
        </div>

        <p className="detail-content">{lp.content}</p>

        <div className="detail-tags">
          {lp.tags?.map((tag) => (
            <span key={tag.id}># {tag.name}</span>
          ))}
        </div>

        <button
          type="button"
          className={`detail-like-button ${isLiked ? "liked" : ""}`}
          disabled={likeMutation.isPending}
          onClick={() => likeMutation.mutate()}
        >
          {isLiked ? "💗" : "♡"} {lp.likes?.length ?? 0}
        </button>
      </article>

      <LpCommentSection lpid={lpid} />

      {isEditModalOpen && (
        <LpEditorModal
          mode="edit"
          lp={lp}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </section>
  );
};

export default LpDetailPage;