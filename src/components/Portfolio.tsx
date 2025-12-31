'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([{ id: 'all', label: 'All Projects' }]);
  const [loading, setLoading] = useState(true);

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    if (!category) return 'Uncategorized';
    // Handle common cases
    const categoryLower = category.toLowerCase();
    const labelMap: { [key: string]: string } = {
      'residential': 'Residential',
      'commercial': 'Commercial',
      'institutional': 'Institutional',
    };

    if (labelMap[categoryLower]) {
      return labelMap[categoryLower];
    }

    // Format other categories: capitalize first letter of each word
    return category
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        const projectsData = (data || []).map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        setProjects(projectsData);

        // Extract unique categories from backend data
        const uniqueCategories = new Set<string>();
        projectsData.forEach((project: Project) => {
          if (project.category && project.category.trim()) {
            uniqueCategories.add(project.category.trim().toLowerCase());
          }
        });

        // Sort categories and format labels
        const sortedCategories = Array.from(uniqueCategories).sort();
        const dynamicCategories = [
          { id: 'all', label: 'All Projects' },
          ...sortedCategories.map(cat => ({
            id: cat,
            label: formatCategoryLabel(cat)
          }))
        ];
        setCategories(dynamicCategories);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category?.toLowerCase().trim() === selectedCategory.toLowerCase());

  if (loading) {
    return (
      <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#009f3b] mb-2">
            Our Portfolio
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Explore our completed projects and architectural achievements
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap justify-start gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory.toLowerCase() === category.id.toLowerCase();
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold uppercase transition-all duration-300 ${
                    isActive
                      ? 'bg-[#009f3b] text-white'
                      : 'bg-gray-200 text-[#009f3b] hover:bg-gray-300'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project._id || project.id}
              href={`/portfolio/${project._id || project.id}`}
              className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer block"
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
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-[#009f3b] opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-3 md:p-4">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-base md:text-lg font-bold text-[#009f3b] group-hover:text-[#00782d] transition-colors flex-1">
                    {project.title}
                  </h3>
                  {project.year && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                      {project.year}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>
                {project.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{project.location}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;

