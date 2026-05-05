import { useParams, useNavigate } from "react-router-dom";
import { useGetCatDetail } from "../hooks/useGetCatDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCat, postLikeCat } from "../apis/cat";
import CatDetailSkeleton from "../components/CatDetailSkeleton";

const CatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetCatDetail(id);

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

  if (isPending) {
    return <CatDetailSkeleton />;
  }

  if (isError) {
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

  const cat = data.data;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
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
    </div>
  );
};

export default CatDetailPage;