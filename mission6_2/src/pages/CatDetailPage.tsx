import { useParams, useNavigate } from "react-router-dom";
import { useGetCatDetail } from "../hooks/useGetCatDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCat, postLikeCat, postCatComment } from "../apis/cat";
import CatDetailSkeleton from "../components/CatDetailSkeleton";
import { useState, useEffect, useRef } from "react";
import useGetCatComments from "../hooks/useGetCatComments";
import CommentSkeleton from "../components/CommentSkeleton";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types/cat";

interface CommentFormValue {
  content: string;
}

const CatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  
  const { data: catData, isPending: isCatPending, isError: isCatError } = useGetCatDetail(id);
  
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments
  } = useGetCatComments({
    catId: id!,
    order,
    limit: 5,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormValue>();

  const observerElem = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerElem.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerElem.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteCat(id!),
    onSuccess: () => {
      alert("삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      navigate("/");
    },
    onError: () => alert("삭제 실패했습니다."),
  });

  const likeMutation = useMutation({
    mutationFn: () => postLikeCat(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cat", id] });
    },
    onError: () => alert("좋아요 처리에 실패했습니다."),
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => postCatComment(id!, content),
    onSuccess: () => {
      alert("댓글이 등록되었습니다.");
      reset();
      queryClient.invalidateQueries({ queryKey: ['catComments', id] });
    },
    onError: () => alert("댓글 등록에 실패했습니다."),
  });

  const onCommentSubmit = (data: CommentFormValue) => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    commentMutation.mutate(data.content);
  };

  if (isCatPending) {
    return <CatDetailSkeleton />;
  }

  if (isCatError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl">문제가 생겼고영🐈‍⬛</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border rounded hover:bg-gray-50 transition"
        >
          다시 시도 (목록으로)
        </button>
      </div>
    );
  }

  const cat = catData.data;
  const comments: Comment[] = commentData?.pages.flatMap(page => page.data.data) ?? [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* 이미지 섹션 */}
        <div className="relative w-full h-[400px] md:h-[500px]">
          <img
            src={cat.thumbnail}
            alt={cat.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => likeMutation.mutate()}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-pink-50 transition-colors text-pink-500"
            >
              ❤️ {cat.likes?.length ?? 0}
            </button>
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {cat.title}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date(cat.createdAt).toLocaleDateString()} 업로드
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (confirm("정말 삭제하시겠습니까?")) {
                    deleteMutation.mutate();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
              >
                삭제
              </button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {cat.content}
          </div>

          {cat.tags && cat.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {cat.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          댓글 <span className="text-blue-600 text-lg">{comments.length}+</span>
        </h2>

        {/* 댓글 작성 */}
        <form onSubmit={handleSubmit(onCommentSubmit)} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <textarea
                {...register("content", { required: "댓글 내용을 입력해주세요." })}
                placeholder={accessToken ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
                disabled={!accessToken}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!accessToken || commentMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                등록
              </button>
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
        </form>

        {/* 정렬 버튼 */}
        <div className="flex gap-4 mb-6 border-b pb-4">
          <button
            onClick={() => setOrder("desc")}
            className={`text-sm font-medium ${order === "desc" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder("asc")}
            className={`text-sm font-medium ${order === "asc" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            오래된순
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isCommentsLoading && (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          )}

          {isCommentsError && (
            <div className="text-center py-10 text-gray-500">
              댓글을 불러오는 중 문제가 발생했습니다.
              <button onClick={() => refetchComments()} className="ml-2 text-blue-600 underline">다시 시도</button>
            </div>
          )}

          {!isCommentsLoading && comments.length === 0 && (
            <p className="text-center py-10 text-gray-500">첫 번째 댓글을 남겨보세요! 🐾</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 border-b last:border-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 overflow-hidden">
                {comment.author.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                ) : (
                  comment.author.name[0]
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900">{comment.author.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}

          {isFetchingNextPage && (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          )}

          <div ref={observerElem} className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default CatDetailPage;