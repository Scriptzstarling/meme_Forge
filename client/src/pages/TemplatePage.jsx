import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Search, Grid3X3, Image as ImageIcon } from 'lucide-react';

const TemplatePage = ({ onBackToHome, onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 24;

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, templates]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/images.json');
      const imageFiles = await response.json();
      
      const templateData = imageFiles.map((filename, index) => ({
        id: index + 1,
        name: filename.replace(/\.(png|jpe?g|gif|webp)$/i, '').replace(/[-_]/g, ' '),
        url: filename.startsWith('http') ? filename : `/${filename}`,
        category: getCategoryFromFilename(filename)
      }));
      
      setTemplates(templateData);
      setFilteredTemplates(templateData);
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fallback to default templates if images.json fails
      const fallbackTemplates = [
        { id: 1, name: 'Sample Template 1', url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'General' },
        { id: 2, name: 'Sample Template 2', url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'General' }
      ];
      setTemplates(fallbackTemplates);
      setFilteredTemplates(fallbackTemplates);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromFilename = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('cat') || name.includes('dog') || name.includes('animal')) return 'Animals';
    if (name.includes('face') || name.includes('person') || name.includes('man') || name.includes('woman')) return 'People';
    if (name.includes('meme') || name.includes('funny')) return 'Classic';
    return 'General';
  };

  const filterTemplates = () => {
    if (!searchTerm.trim()) {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
    setCurrentPage(1);
  };

  const handleTemplateClick = (template) => {
    onTemplateSelect(template.url);
    onBackToHome();
  };

  // Pagination
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

  const categories = [...new Set(templates.map(t => t.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Meme Templates</h1>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="bg-white px-3 py-2 rounded-lg border">
                {filteredTemplates.length} templates found
              </span>
              <span className="bg-white px-3 py-2 rounded-lg border">
                {categories.length} categories
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchTerm ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchTerm === category ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {currentTemplates.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {currentTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={template.url}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <ImageIcon className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Use Template</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs font-medium truncate">
                      {template.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {template.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

TemplatePage.propTypes = {
  onBackToHome: PropTypes.func.isRequired,
  onTemplateSelect: PropTypes.func.isRequired,
};

export default TemplatePage;