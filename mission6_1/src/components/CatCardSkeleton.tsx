export default function CatCardSkeleton() {
  return (
    <div className="border rounded overflow-hidden animate-pulse">
      
      {/* 이미지 자리 */}
      <div className=" h-48 bg-gray-300" />

      <div className="p-2 bg-gray-100space-y-2">
        {/* 제목 */}
        <div className="h-4 bg-gray-300 rounded w-3/4" />

        {/* 날짜 */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />

        {/* 좋아요 */}
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}