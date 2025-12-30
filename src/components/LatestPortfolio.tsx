'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Grid3x3, List } from 'lucide-react';

type Project = {
  _id?: string;
  id?: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
  year?: string;
  location?: string;
};

const LatestPortfolio = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        // Get latest 3 projects
        const projects = (data || []).slice(0, 3).map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        setLatestProjects(projects);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-12 md:py-16 px-4 bg-white relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231a4d3a' fill-opacity='0.08'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
          transform: 'rotate(45deg)',
          transformOrigin: 'center',
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%'
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#009f3b] mb-2">
              latest portfolio
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Discover our most recent architectural projects and achievements
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#009f3b] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#009f3b] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button className="bg-[#009f3b] text-white px-6 py-2 md:px-8 md:py-3 rounded-none font-semibold uppercase hover:bg-[#00782d] transition-colors shadow-lg text-xs md:text-sm">
              VIEW ALL PORTFOLIO
            </button>
          </div>
        </div>

        {/* Projects - Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {latestProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project._id || project.id}`}
                className="bg-white overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow block"
              >
                {/* Project Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#009f3b] text-white px-3 py-1 text-xs font-semibold uppercase">
                      {project.category}
                    </span>
                  </div>
                  {/* Year Badge */}
                  {project.year && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-[#009f3b] px-3 py-1 text-xs font-bold">
                        {project.year}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-5 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-[#009f3b] mb-3">
                    {project.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  {project.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Projects - List View */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {latestProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project._id || project.id}`}
                className="bg-white overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow flex flex-col md:flex-row block"
              >
                {/* Project Image */}
                <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#009f3b] text-white px-3 py-1 text-xs font-semibold uppercase">
                      {project.category}
                    </span>
                  </div>
                  {/* Year Badge */}
                  {project.year && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-[#009f3b] px-3 py-1 text-xs font-bold">
                        {project.year}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#009f3b] mb-3">
                      {project.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4">
                      {project.description}
                    </p>
                  </div>
                  {project.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
      {loading && (
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
      )}
    </section>
  );
};

export default LatestPortfolio;

