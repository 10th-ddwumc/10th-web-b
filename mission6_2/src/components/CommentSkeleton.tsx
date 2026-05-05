export default function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-4 border-b animate-pulse">
      {/* 아바타 */}
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          {/* 작성자 이름 */}
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          {/* 날짜 */}
          <div className="h-3 bg-gray-100 rounded w-1/6" />
        </div>
        
        {/* 댓글 내용 */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}