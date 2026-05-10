export default function CatDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* 이미지 섹션 스켈레톤 */}
        <div className="w-full h-[400px] md:h-[500px] bg-gray-200" />

        {/* 컨텐츠 섹션 스켈레톤 */}
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {/* 제목 스켈레톤 */}
              <div className="h-9 bg-gray-300 rounded-lg w-3/4 mb-4" />
              {/* 날짜 스켈레톤 */}
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            
            <div className="flex gap-2">
              {/* 버튼 스켈레톤 */}
              <div className="w-16 h-9 bg-gray-200 rounded-lg" />
              <div className="w-16 h-9 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* 본문 스켈레톤 */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>

          {/* 태그 섹션 스켈레톤 */}
          <div className="mt-10 flex gap-2">
            <div className="w-16 h-6 bg-gray-200 rounded-full" />
            <div className="w-20 h-6 bg-gray-200 rounded-full" />
            <div className="w-14 h-6 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}