export default function CatCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-300" />
      <div className="p-4 bg-white space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}