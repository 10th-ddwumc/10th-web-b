// src/pages/LpDetailPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp, likeLp } from "../api/lp";
import LoadingError from "../components/common/LoadingError";
import LpCommentSection from "../components/lp/LpCommentSection";
import { useLpDetail } from "../hooks/useLpDetail";
import "../styles/LpPage.css";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useLpDetail(lpid);

  const lp = data?.data;

  const likeMutation = useMutation({
    mutationFn: () => likeLp(lpid!),
    onSuccess: () => {
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
            <button type="button">✎</button>
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
          className="detail-like-button"
          onClick={() => likeMutation.mutate()}
        >
          💗 {lp.likes?.length ?? 0}
        </button>
      </article>

      <LpCommentSection lpid={lpid} />
    </section>
  );
};

export default LpDetailPage;