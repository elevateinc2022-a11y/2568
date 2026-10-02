import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, Search, Loader2 } from 'lucide-react';
import ResearchCard from './ResearchCard';
import { ResearchPaper } from '../types';

interface ResearchPageProps {
  initialPapers: ResearchPaper[];
  selectedPaperId: string | null;
  onSelectPaper: (id: string) => void;
  onClearSelectedPaper: () => void;
}

const ResearchPage: React.FC<ResearchPageProps> = ({ initialPapers, selectedPaperId, onSelectPaper, onClearSelectedPaper }) => {
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const selectedPaper = selectedPaperId ? initialPapers.find(p => p.id === selectedPaperId) : null;

  const availableTags = Array.from(new Set(initialPapers.flatMap(p => p.tags || []))).sort();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onClearSelectedPaper();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const displayedPapers = initialPapers.filter(p => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => p.tags?.includes(tag));
    
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return matchesTags;

    const searchTerms = searchLower.split(/\s+/).filter(Boolean);
    const matchesSearch = searchTerms.every(term => 
      p.title.toLowerCase().includes(term) ||
      p.author.toLowerCase().includes(term) ||
      p.abstract.toLowerCase().includes(term) ||
      p.tags?.some(tag => tag.toLowerCase().includes(term))
    );

    return matchesTags && matchesSearch;
  });

  if (selectedPaper) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onClearSelectedPaper}
            className="flex items-center text-brand-600 font-medium hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Research Library
          </button>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="h-64 md:h-80 overflow-hidden relative">
              <img
                src={selectedPaper.imageUrl || "https://picsum.photos/seed/default/1200/400"}
                alt={selectedPaper.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:left-10 text-white">
                 <div className="flex gap-2 mb-3">
                   {selectedPaper.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-brand-600/90 backdrop-blur-sm text-xs font-bold rounded uppercase tracking-wide">
                        {tag}
                      </span>
                   ))}
                 </div>
                 <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">{selectedPaper.title}</h1>
              </div>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center text-slate-500 text-sm border-b border-slate-100 pb-6">
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-6 font-medium text-slate-900">{selectedPaper.author}</span>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(selectedPaper.date).toLocaleDateString()}</span>
                  </div>

                  <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-4">Abstract</h3>
                     <p className="text-slate-600 leading-relaxed text-lg">
                       {selectedPaper.abstract}
                     </p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                     <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
                     <a
                       href={selectedPaper.pdfUrl || "#"}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full flex items-center justify-center bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm mb-3"
                     >
                       Read Full Text Here
                     </a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Research Library</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Search</h3>
                        <form onSubmit={(e) => handleSearch(e)} className="relative">
                          <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Keywords..."
                              className="w-full pl-3 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                          <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-brand-600">
                              <Search className="h-4 w-4" />
                          </button>
                        </form>
                    </div>

                    {availableTags.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900">Filter Results</h3>
                                {selectedTags.length > 0 && (
                                    <button onClick={() => setSelectedTags([])} className="text-xs text-brand-600 hover:underline">Clear</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {availableTags.map(tag => (
                                    <label key={tag} className="flex items-start space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(tag)}
                                                onChange={() => handleTagToggle(tag)}
                                                className="peer h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:ring-2 focus:ring-offset-0 transition-all cursor-pointer"
                                            />
                                        </div>
                                        <span className={`text-sm leading-tight group-hover:text-brand-700 transition-colors ${selectedTags.includes(tag) ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                            {tag}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <div className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
                            <p className="text-slate-600">Curating research papers...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-slate-500">
                                Showing {displayedPapers.length} results
                                {selectedTags.length > 0 && <span> matching <strong>all {selectedTags.length}</strong> selected topic(s)</span>}
                            </div>

                            {displayedPapers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {displayedPapers.map((paper, idx) => (
                                        <ResearchCard
                                          key={paper.id || idx}
                                          paper={paper}
                                          onClick={(p) => onSelectPaper(p.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                                    <p className="text-slate-500">No papers found matching all selected criteria.</p>
                                    <button onClick={() => setSelectedTags([])} className="mt-4 text-brand-600 font-medium hover:underline">
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ResearchPage;