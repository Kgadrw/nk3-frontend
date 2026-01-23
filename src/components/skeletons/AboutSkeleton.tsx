export default function AboutSkeleton() {
  return (
    <main className="min-h-screen bg-white animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-[25vh] md:h-[30vh] min-h-[200px] md:min-h-[250px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-200"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6">
            <div className="max-w-2xl">
              <div className="h-12 md:h-16 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-6 md:h-8 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout Skeleton */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Image Skeleton */}
          <div className="relative w-full h-full min-h-[400px] bg-gray-200 rounded"></div>

          {/* Right Column - Text Skeleton */}
          <div className="bg-white p-6 md:p-8 lg:p-10 flex flex-col justify-center space-y-4">
            <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Text Section - Two Column Layout Skeleton */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Text Skeleton */}
          <div className="bg-white p-6 md:p-8 lg:p-10 flex flex-col justify-center space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Right Column - Image Skeleton */}
          <div className="relative w-full h-full min-h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Services Section Skeleton */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 py-8 md:py-12">
        <div className="p-6 md:p-8">
          {/* Heading Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8">
            <div className="h-10 md:h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
          
          {/* Service Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="relative p-6 flex flex-col items-center text-center min-h-[200px] bg-gray-200 rounded overflow-hidden"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
