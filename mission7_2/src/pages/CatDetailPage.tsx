import { useParams, useNavigate } from "react-router-dom";
import { useGetCatDetail } from "../hooks/useGetCatDetail";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { deleteCat, postLikeCat, deleteLikeCat, postCatComment, patchCatComment, deleteCatComment } from "../apis/cat";
import { getMyInfo } from "../apis/auth";
import CatDetailSkeleton from "../components/CatDetailSkeleton";
import { useState, useEffect, useRef } from "react";
import useGetCatComments from "../hooks/useGetCatComments";
import CommentSkeleton from "../components/CommentSkeleton";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types/cat";
import { MoreVertical, Edit2, Trash2, X, Check, Heart } from "lucide-react";
import PostModal from "../components/PostModal";

interface CommentFormValue {
  content: string;
}

const CatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { data: catData, isPending: isCatPending, isError: isCatError } = useGetCatDetail(id);
  
  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

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
    mutationFn: () => {
      if (isLiked) {
        return deleteLikeCat(id!);
      }
      return postLikeCat(id!);
    },
    onMutate: async () => {
      // 1. 발송된 refetch를 취소하여 낙관적 업데이트를 덮어쓰지 않도록 함
      await queryClient.cancelQueries({ queryKey: ["cat", id] });
      await queryClient.cancelQueries({ queryKey: ["cats"] });

      // 2. 이전 값 스냅샷 저장
      const previousCat = queryClient.getQueryData(["cat", id]);

      // 3. 낙관적 업데이트 (상세 정보)
      if (previousCat) {
        queryClient.setQueryData(["cat", id], (old: any) => {
          const currentCat = old.data;
          const currentUserId = myInfo?.data.id;
          
          let newLikes = [...(currentCat.likes || [])];
          if (isLiked) {
            newLikes = newLikes.filter(like => like.userId !== currentUserId);
          } else {
            newLikes.push({ userId: currentUserId, lpId: Number(id) });
          }

          return {
            ...old,
            data: {
              ...currentCat,
              likes: newLikes
            }
          };
        });
      }

      // 4. 낙관적 업데이트 (목록 정보 - InfiniteQuery 대응)
      queryClient.setQueriesData({ queryKey: ["cats"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map((cat: any) => {
                if (cat.id === Number(id)) {
                  let newLikes = [...(cat.likes || [])];
                  const currentUserId = myInfo?.data.id;
                  if (isLiked) {
                    newLikes = newLikes.filter(like => like.userId !== currentUserId);
                  } else {
                    newLikes.push({ userId: currentUserId, lpId: Number(id) });
                  }
                  return { ...cat, likes: newLikes };
                }
                return cat;
              })
            }
          }))
        };
      });

      return { previousCat };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 롤백
      if (context?.previousCat) {
        queryClient.setQueryData(["cat", id], context.previousCat);
      }
      alert("좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      // 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ["cat", id] });
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => postCatComment(id!, content),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['catComments', id] });
    },
    onError: () => alert("댓글 등록에 실패했습니다."),
  });

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number, content: string }) => 
      patchCatComment(id!, commentId, content),
    onSuccess: () => {
      setEditingCommentId(null);
      queryClient.invalidateQueries({ queryKey: ['catComments', id] });
    },
    onError: () => alert("댓글 수정에 실패했습니다."),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteCatComment(id!, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catComments', id] });
    },
    onError: () => alert("댓글 삭제에 실패했습니다."),
  });

  const onCommentSubmit = (data: CommentFormValue) => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    commentMutation.mutate(data.content);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setActiveMenuId(null);
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId);
    }
    setActiveMenuId(null);
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
  const currentUserId = myInfo?.data.id;
  const isLiked = cat.likes?.some(like => like.userId === currentUserId);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <PostModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={cat} 
      />
      
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* 이미지 섹션 */}
        <div className="relative w-full h-[400px] md:h-[600px] bg-gray-50">
          <img
            src={cat.thumbnail}
            alt={cat.title}
            className="w-full h-full object-contain md:object-cover"
          />
          <div className="absolute top-6 right-6 flex gap-2">
            <button
              onClick={() => likeMutation.mutate()}
              className={`backdrop-blur-md p-4 rounded-3xl shadow-2xl transition-all transform active:scale-90 flex items-center gap-2 font-black ${isLiked ? 'bg-pink-500 text-white' : 'bg-white/80 text-pink-500 hover:bg-pink-50'}`}
            >
              <Heart fill={isLiked ? "currentColor" : "none"} size={24} />
              {cat.likes?.length ?? 0}
            </button>
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                  {cat.author?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{cat.author?.name || "Unknown Author"}</p>
                  <p className="text-xs text-gray-400 font-medium">{new Date(cat.createdAt).toLocaleDateString()} 포스팅</p>
                </div>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {cat.title}
              </h1>
            </div>
            
            {cat.authorId === currentUserId && (
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 md:flex-none px-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> 수정
                </button>
                <button
                  onClick={() => {
                    if (confirm("정말 삭제하시겠습니까?")) {
                      deleteMutation.mutate();
                    }
                  }}
                  className="flex-1 md:flex-none px-6 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> 삭제
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
            {cat.content}
          </div>

          {cat.tags && cat.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-50 flex flex-wrap gap-2">
              {cat.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-black tracking-wider"
                >
                  #{tag.name.toUpperCase()}
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
            <div key={comment.id} className="flex gap-3 p-4 border-b last:border-0 relative">
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {comment.authorId === currentUserId && (
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuId === comment.id && (
                          <div className="absolute right-0 top-8 bg-white shadow-lg border rounded-lg py-1 z-10 w-24">
                            <button 
                              onClick={() => handleEditComment(comment)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit2 size={14} /> 수정
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-500 flex items-center gap-2"
                            >
                              <Trash2 size={14} /> 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => setEditingCommentId(null)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => editCommentMutation.mutate({ commentId: comment.id, content: editContent })}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                )}
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