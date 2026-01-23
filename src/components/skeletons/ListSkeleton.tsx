interface ListSkeletonProps {
  count?: number;
  showImage?: boolean;
}

export default function ListSkeleton({ count = 5, showImage = true }: ListSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
          {showImage && (
            <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
          )}
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
