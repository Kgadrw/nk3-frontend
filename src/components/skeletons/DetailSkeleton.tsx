export default function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button skeleton */}
        <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
          
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
