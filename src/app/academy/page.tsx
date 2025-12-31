'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import { Maximize, Minimize, X } from 'lucide-react';

export default function AcademyPage() {
  const [researchPublications, setResearchPublications] = useState<any[]>([]);
  const [allPublications, setAllPublications] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfViewerRef = useRef<HTMLDivElement>(null);

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    if (!category) return 'Uncategorized';
    // Format: capitalize first letter of each word
    return category
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch('/api/academic');
        const data = await res.json();
        const publications = (data || []).map((p: any) => ({
          ...p,
          id: p._id || p.id,
          date: p.year || p.date,
          abstract: p.description || p.abstract,
          pdf: p.pdfLink || p.pdf || '#',
          citation: `${p.author}. (${p.year || 'N/A'}). ${p.title}. NK 3D Academy Research Journal.`
        }));
        setAllPublications(publications);
        setResearchPublications(publications);

        // Extract unique categories from backend data
        const uniqueCategories = new Set<string>();
        publications.forEach((pub: any) => {
          if (pub.category && pub.category.trim()) {
            uniqueCategories.add(pub.category.trim().toLowerCase());
          }
        });
        
        // Sort categories (store raw values, format for display)
        const sortedCategories = Array.from(uniqueCategories).sort();
        const formattedCategories = ['All', ...sortedCategories];
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  // Filter publications by selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setResearchPublications(allPublications);
    } else {
      const filtered = allPublications.filter((pub: any) => {
        const pubCategory = pub.category ? pub.category.trim().toLowerCase() : 'uncategorized';
        return pubCategory === selectedCategory.toLowerCase();
      });
      setResearchPublications(filtered);
    }
  }, [selectedCategory, allPublications]);
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-[#009f3b] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">NK 3D Academy</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
                Publishing academic research in architecture, engineering, and construction. Advancing knowledge and innovation in the built environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-8 md:py-12">
        {/* Research Publications */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#009f3b]">Research Publications</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const displayLabel = category === 'All' ? 'All' : formatCategoryLabel(category);
                const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 font-semibold transition-colors text-sm ${
                      isActive
                        ? 'bg-[#009f3b] text-white'
                        : 'bg-gray-100 text-[#009f3b] hover:bg-[#009f3b] hover:text-white'
                    }`}
                  >
                    {displayLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Publications Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Image
                src="/loader.gif"
                alt="Loading..."
                width={100}
                height={100}
                className="mx-auto"
                unoptimized
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchPublications.map((publication) => (
              <div key={publication._id || publication.id} className="bg-white border border-gray-200 p-6">
                <div className="mb-3">
                  {publication.category && (
                    <span className="text-xs font-semibold text-[#009f3b] bg-gray-100 px-3 py-1 rounded">
                      {formatCategoryLabel(publication.category)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 ml-2">{publication.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#009f3b] mb-3 leading-tight">
                  {publication.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Author:</span> {publication.author}
                </p>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {publication.abstract}
                </p>
                
                <div className="flex gap-3 flex-wrap">
                  {publication.pdf && publication.pdf !== '#' && (
                    <>
                      <button
                        onClick={() => {
                          const publicationId = publication._id || publication.id;
                          if (publicationId) {
                            setCurrentPdfUrl(`/api/academic/pdf/${publicationId}`);
                            setShowPdfViewer(true);
                          }
                        }}
                        className="text-sm text-[#009f3b] font-semibold hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View PDF
                      </button>
                      <a
                        href={`/api/academic/pdf/${publication._id || publication.id}?download=true`}
                        download
                        className="text-sm text-gray-600 hover:text-[#009f3b] font-semibold hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </a>
                    </>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div 
          ref={pdfViewerRef}
          className={`fixed bg-black bg-opacity-75 z-50 flex items-center justify-center transition-all ${
            isFullscreen ? 'inset-0 p-0' : 'inset-0 p-4'
          }`}
        >
          <div className={`bg-white rounded-lg flex flex-col transition-all ${
            isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
          }`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">PDF Viewer</h3>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!isFullscreen) {
                      // Enter fullscreen
                      if (pdfViewerRef.current?.requestFullscreen) {
                        await pdfViewerRef.current.requestFullscreen();
                      }
                      setIsFullscreen(true);
                    } else {
                      // Exit fullscreen
                      if (document.exitFullscreen) {
                        await document.exitFullscreen();
                      }
                      setIsFullscreen(false);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Maximize className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPdfViewer(false);
                    setCurrentPdfUrl('');
                    setIsFullscreen(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Close PDF viewer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={currentPdfUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <a
                href={currentPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in New Tab
              </a>
              <a
                href={`${currentPdfUrl}?download=true`}
                download
                className="px-4 py-2 bg-[#009f3b] text-white rounded hover:bg-[#00782d] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </main>
  );
}