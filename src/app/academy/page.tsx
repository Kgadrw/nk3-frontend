'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import { Maximize, Minimize, X } from 'lucide-react';
import { ToastContainer, Toast, ToastType } from '@/components/Toast';

type ActiveSection = 'research' | 'seminars' | 'internship';

export default function AcademyPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('research');
  
  // Research & Publications state
  const [researchPublications, setResearchPublications] = useState<any[]>([]);
  const [allPublications, setAllPublications] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  
  // Seminars & Workshops state
  const [seminars, setSeminars] = useState<any[]>([]);
  const [seminarsLoading, setSeminarsLoading] = useState(true);
  
  // Internship Application state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    fieldOfStudy: '',
    currentYear: '',
    startDate: '',
    duration: '',
    coverLetter: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    if (!category) return 'Uncategorized';
    return category
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch publications
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
          link: p.link || '',
          citation: `${p.author}. (${p.year || 'N/A'}). ${p.title}. NK 3D Academy Research Journal.`
        }));
        setAllPublications(publications);
        setResearchPublications(publications);

        const uniqueCategories = new Set<string>();
        publications.forEach((pub: any) => {
          if (pub.category && pub.category.trim()) {
            uniqueCategories.add(pub.category.trim().toLowerCase());
          }
        });
        
        const sortedCategories = Array.from(uniqueCategories).sort();
        const formattedCategories = ['All', ...sortedCategories];
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setPublicationsLoading(false);
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

  // Fetch seminars
  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const res = await fetch('/api/seminars');
        const data = await res.json();
        setSeminars(data || []);
      } catch (error) {
        console.error('Error fetching seminars:', error);
      } finally {
        setSeminarsLoading(false);
      }
    };
    fetchSeminars();
  }, []);
  
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

  // Handle internship form submission
  const handleInternshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('Thank you for your application! We will review it and get back to you soon.', 'success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          institution: '',
          fieldOfStudy: '',
          currentYear: '',
          startDate: '',
          duration: '',
          coverLetter: ''
        });
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.error || 'Failed to submit application. Please try again.'}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      showToast('Error submitting application. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
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

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSection('research')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeSection === 'research'
                  ? 'bg-[#009f3b] text-white border-b-2 border-[#009f3b]'
                  : 'text-gray-700 hover:text-[#009f3b] hover:bg-gray-50'
              }`}
            >
              Research & Publication
            </button>
            <button
              onClick={() => setActiveSection('seminars')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeSection === 'seminars'
                  ? 'bg-[#009f3b] text-white border-b-2 border-[#009f3b]'
                  : 'text-gray-700 hover:text-[#009f3b] hover:bg-gray-50'
              }`}
            >
              Seminars & Workshops
            </button>
            <button
              onClick={() => setActiveSection('internship')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeSection === 'internship'
                  ? 'bg-[#009f3b] text-white border-b-2 border-[#009f3b]'
                  : 'text-gray-700 hover:text-[#009f3b] hover:bg-gray-50'
              }`}
            >
              Internship Application
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-8 md:py-12">
        {/* Research & Publication Section */}
        {activeSection === 'research' && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#009f3b]">Research Publications</h2>
              <div className="w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-64 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent text-gray-700 font-semibold bg-white"
                >
                  {categories.map((category) => {
                    const displayLabel = category === 'All' ? 'All' : formatCategoryLabel(category);
                    return (
                      <option key={category} value={category}>
                        {displayLabel}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {publicationsLoading ? (
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
                      {publication.link && publication.link.trim() ? (
                        <a
                          href={publication.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#009f3b] font-semibold hover:underline flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Follow Link
                        </a>
                      ) : publication.pdf && publication.pdf !== '#' ? (
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
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Seminars & Workshops Section */}
        {activeSection === 'seminars' && (
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#009f3b] mb-6">Seminars & Workshops</h2>
            
            {seminarsLoading ? (
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
            ) : seminars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seminars.map((seminar) => (
                  <div key={seminar._id || seminar.id} className="bg-white border border-gray-200 p-6">
                    {seminar.image && (
                      <div className="mb-4">
                        <Image
                          src={seminar.image}
                          alt={seminar.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${
                        seminar.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        seminar.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {seminar.status?.charAt(0).toUpperCase() + seminar.status?.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#009f3b] mb-3 leading-tight">
                      {seminar.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {seminar.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      {seminar.date && (
                        <p><span className="font-semibold">Date:</span> {seminar.date}</p>
                      )}
                      {seminar.time && (
                        <p><span className="font-semibold">Time:</span> {seminar.time}</p>
                      )}
                      {seminar.location && (
                        <p><span className="font-semibold">Location:</span> {seminar.location}</p>
                      )}
                      {seminar.instructor && (
                        <p><span className="font-semibold">Instructor:</span> {seminar.instructor}</p>
                      )}
                    </div>
                    {seminar.registrationLink && (
                      <a
                        href={seminar.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block px-4 py-2 bg-[#009f3b] text-white font-semibold hover:bg-[#00782d] transition-colors"
                      >
                        Register Now
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No seminars or workshops available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Internship Application Section */}
        {activeSection === 'internship' && (
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#009f3b] mb-6">Internship Application</h2>
            <p className="text-gray-700 mb-8 max-w-3xl">
              Are you a student looking for an internship opportunity in architecture, engineering, or construction? 
              Fill out the form below and we'll review your application.
            </p>
            
            <div className="max-w-3xl">
              <form onSubmit={handleInternshipSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="institution" className="block text-sm font-semibold text-gray-700 mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="fieldOfStudy" className="block text-sm font-semibold text-gray-700 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      id="fieldOfStudy"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="currentYear" className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Year
                    </label>
                    <input
                      type="text"
                      id="currentYear"
                      name="currentYear"
                      value={formData.currentYear}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleFormChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#009f3b] text-white font-semibold hover:bg-[#00782d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div 
          ref={pdfViewerRef}
          className={`fixed backdrop-blur-md bg-white/10 z-50 flex items-center justify-center transition-all ${
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
                      if (pdfViewerRef.current?.requestFullscreen) {
                        await pdfViewerRef.current.requestFullscreen();
                      }
                      setIsFullscreen(true);
                    } else {
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
