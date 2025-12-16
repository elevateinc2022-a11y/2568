import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ResearchCard from './components/ResearchCard';
import PaperManagement from './components/PaperManagement';
import EventManagement from './components/EventManagement';
import ConferenceManagement from './components/ConferenceManagement';
import FAQManagement from './components/FAQManagement';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import PrivacyPolicyContent from './components/PrivacyPolicyContent';
import { fetchResearchPapers } from './services/geminiService';
import { getPapers, signIn, signOut, getCurrentUser, getEvents, getFaqs, getGlobalConferences } from './services/supabaseService';
import { supabase } from './supabaseClient'; // New import
import { Search, ChevronRight, ChevronLeft, Calendar, Users, BookOpen, BarChart3, MapPin, Loader2, Check, User, X, Plus, Minus, Globe, Lock, Play, Pause, Mail, Bot, Download, ArrowLeft } from 'lucide-react';
import { Page, ResearchPaper, Event, GlobalConference, FAQ } from './types';



// --- Page Components ---

const Home: React.FC<{ setCurrentPage: (page: Page) => void, setSelectedPaperId: (id: string | null) => void, papers: ResearchPaper[] }> = ({ setCurrentPage, setSelectedPaperId, papers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const featured = papers.slice(0, 4);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && featured.length > 0) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % featured.length);
      }, 5000); // Pan every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isPaused, featured.length]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % featured.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length);

  if (featured.length === 0) return (
    <div className="py-20 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
      <p className="text-slate-500 mt-2">Loading research...</p>
    </div>
  );

  const currentPaper = featured[activeIndex];

  return (
    <>
      {/* Hero Section */}
      <header className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <img src="https://picsum.photos/seed/oerc_hero/1920/1080?grayscale&blur=2" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:w-2/3">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Advancing Education Through <span className="text-brand-400">Evidence and Innovation</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              The Ontario Educational Research Consortium bridges the gap between academic research and classroom practice, empowering educators with data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setCurrentPage(Page.RESEARCH)} className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-brand-500/30 transition-all duration-300 flex items-center justify-center">
                Explore Research <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button onClick={() => setCurrentPage(Page.ABOUT)} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg transition-all duration-300">
                Learn About Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Research Carousel Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Latest Research Highlights</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Explore the most recent summaries from our research community.</p>
          </div>
          
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-w-6xl mx-auto group">
            {/* Pause/Play Control - Visible on Hover or Interaction */}
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                {isPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
                {isPaused ? "Resume" : "Pause Pan"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[450px]">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img 
                  src={currentPaper.imageUrl || "https://picsum.photos/seed/default/800/400"} 
                  alt={currentPaper.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-none"></div>
                <div className="absolute bottom-4 left-4 md:hidden text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-brand-600 px-2 py-1 rounded mb-2 inline-block">
                        {currentPaper.tags?.[0] || 'Research'}
                    </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center relative">
                <div className="mb-6 hidden md:flex gap-2">
                   {currentPaper.tags?.map((tag) => (
                      <span key={tag} className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded">
                        {tag}
                      </span>
                   ))}
                </div>
                
                <h3 key={currentPaper.id} className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {currentPaper.title}
                </h3>
                
                <div key={`meta-${currentPaper.id}`} className="flex items-center text-slate-500 text-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{currentPaper.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(currentPaper.date).toLocaleDateString()}</span>
                </div>

                <p key={`abs-${currentPaper.id}`} className="text-slate-600 text-lg leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {currentPaper.abstract}
                </p>

                {/* Controls */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button onClick={() => { setCurrentPage(Page.RESEARCH); setSelectedPaperId(currentPaper.id); }} className="text-brand-700 font-semibold hover:text-brand-800 transition-colors flex items-center">
                        Read Full Paper <ChevronRight className="ml-1 h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-4">
                        <button onClick={() => { setIsPaused(true); prevSlide(); }} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        <div className="flex gap-2">
                            {featured.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => { setIsPaused(true); setActiveIndex(idx); }}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-brand-600' : 'w-2 bg-slate-300 hover:bg-brand-400'}`}
                                />
                            ))}
                        </div>

                        <button onClick={() => { setIsPaused(true); nextSlide(); }} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12 text-center">Our Focus Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Curriculum Development</h3>
                    <p className="text-slate-600">Researching effective pedagogical strategies to enhance provincial curriculum standards.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Equity and Inclusion</h3>
                    <p className="text-slate-600">Identifying barriers to education and creating frameworks for inclusive learning environments.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <BarChart3 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Assessment and Analytics</h3>
                    <p className="text-slate-600">Leveraging data analytics to improve student assessment models and feedback mechanisms.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <Bot className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">AI in Education</h3>
                    <p className="text-slate-600">Exploring ethical AI integration to personalize learning paths and support educator capabilities.</p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
};

const About: React.FC = () => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8 text-center">About OERC</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
        <p className="text-lg text-slate-700 leading-relaxed mb-6">
          The Ontario Educational Research Consortium (OERC) is dedicated to enhancing the quality of education by aggregating and synthesizing diverse research from a wide array of sources. We serve as a collaborative hub that brings together rigorous evidence from universities, policy institutes, and school boards to ensure that educational standards in Ontario are grounded in the best available global and local insights.
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          Our mission is to translate this wealth of information into actionable improvements for the classroom. By integrating varied research perspectives, we empower educators and stakeholders with the comprehensive knowledge necessary to foster excellence, equity, and innovation in student learning.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Governance and Structure</h2>
        
        <p className="text-slate-700 leading-relaxed mb-8">
          The Ontario Educational Research Consortium (OERC) operates through a collaborative and transparent governance model that reflects our commitment to accountability, integrity, and educational excellence. Our structure ensures that decisions are made responsibly and in alignment with the needs of educators, learners, and research partners.
        </p>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Board of Directors</h3>
          <p className="text-slate-600 mb-4">
            The Board of Directors provides strategic direction, oversees organizational operations, and ensures alignment with OERC’s mission and long-term goals.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Advisory Committees</h3>
          <p className="text-slate-600 mb-4">
            OERC may establish advisory committees to support specific areas such as research, membership, professional development, and partnerships.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Membership Structure</h3>
          <p className="text-slate-600 mb-4">
            OERC maintains a collaborative membership model that includes educators, institutions, and partners who support our mission. Members contribute to and benefit from shared research, professional networks, and consortium activities.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Operational Structure</h3>
          <p className="text-slate-600 mb-4">
            OERC’s day-to-day operations are supported by designated roles and functions within the organization, ensuring efficient implementation of programs, management of member services, and coordination of research activities.
          </p>
          <p className="text-slate-600 font-semibold mb-2">These functions may include:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Administration</li>
            <li>Research coordination</li>
            <li>Membership support</li>
            <li>Communications</li>
            <li>Program development</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ResearchPage: React.FC<{ initialPapers: ResearchPaper[], setPapers: (papers: ResearchPaper[]) => void, selectedPaperId: string | null, onClearSelectedPaper: () => void }> = ({ initialPapers, setPapers, selectedPaperId, onClearSelectedPaper }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  useEffect(() => {
    if (selectedPaperId && initialPapers.length > 0) {
      const paper = initialPapers.find(p => p.id === selectedPaperId);
      if (paper) {
        setSelectedPaper(paper);
      }
    } else if (!selectedPaperId) {
      setSelectedPaper(null); // Clear selected paper if ID is removed
    }
  }, [selectedPaperId, initialPapers]);


  // Extract unique tags from current papers
  const availableTags = Array.from(new Set(initialPapers.flatMap(p => p.tags || []))).sort();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm;
    if (!query.trim()) return;

    setLoading(true);
    setSelectedTags([]); 
    setSelectedPaper(null); 

    // Combine current papers with new AI fetched ones for the session
    const results = await fetchResearchPapers(query);
    if (results && results.length > 0) {
      setPapers([...results, ...initialPapers]); // Prepend new results
    }
    setLoading(false);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const displayedPapers = selectedTags.length > 0
    ? initialPapers.filter(p => selectedTags.every(tag => p.tags?.includes(tag)))
    : initialPapers;

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
                     <p className="text-slate-600 leading-relaxed mt-4">
                       {/* Placeholder for full content */}
                       This paper explores the theoretical underpinnings and practical applications of the subject matter. It draws upon a wide range of case studies and empirical data to formulate its conclusions. The findings suggest significant implications for educators and policymakers alike, offering a roadmap for future development in this critical area of study.
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
                       <Download className="h-5 w-5 mr-2" />
                       View Paper (PDF)
                     </a>
                     <p className="text-xs text-slate-500 text-center">
                        Available for educational use under CC-BY license.
                     </p>
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
            <p className="text-slate-600 mb-8">Search our AI-powered database or browse by topic.</p>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    {/* Search Widget */}
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

                    {/* Filter by Tag (Current Results) */}
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

                {/* Main Content */}
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
                                          onClick={(p) => setSelectedPaper(p)}
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

// --- Admin Component (New) ---

const DashboardPage: React.FC<{ 
  papers: ResearchPaper[], 
  setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>;
  currentUser: any | null; // Pass currentUser from App.tsx
  setCurrentUser: React.Dispatch<React.SetStateAction<any | null>>; // Pass setCurrentUser from App.tsx
  onSignOut: () => void; // Pass onSignOut from App.tsx
}> = ({ papers, setPapers, currentUser, setCurrentUser, onSignOut }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeManagementTab, setActiveManagementTab] = useState<'papers' | 'events' | 'conferences' | 'faqs'>('papers');
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [conferences, setConferences] = useState<GlobalConference[]>([]);
  const [loadingConferences, setLoadingConferences] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);


  useEffect(() => {
    // currentUser is managed by App.tsx, no need to fetch here again.
    // If currentUser becomes null, it means logout happened from Navbar or elsewhere.
    // If currentUser exists, we are already authenticated.
  }, [currentUser]);

  useEffect(() => {
    const loadEventsData = async () => {
      setLoadingEvents(true);
      const data = await getEvents();
      setEvents(data);
      setLoadingEvents(false);
    };
    loadEventsData();
  }, []); // Empty dependency array means it runs once on mount

  useEffect(() => {
    const loadConferencesData = async () => {
      setLoadingConferences(true);
      const data = await getGlobalConferences();
      setConferences(data);
      setLoadingConferences(false);
    };
    loadConferencesData();
  }, []); // Empty dependency array means it runs once on mount

  useEffect(() => {
    const loadFaqsData = async () => {
      setLoadingFaqs(true);
      const data = await getFaqs();
      setFaqs(data);
      setLoadingFaqs(false);
    };
    loadFaqsData();
  }, []); // Empty dependency array means it runs once on mount

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
    } else {
      setCurrentUser(data.user); // Use setCurrentUser from props
    }
  };
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-100 p-3 rounded-full">
               <Lock className="h-6 w-6 text-brand-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Sign In</h2>
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
            <div className="flex items-center gap-4">
               <span className="text-sm text-slate-500 hidden md:inline">{currentUser.email}</span>
               <button onClick={onSignOut} className="text-slate-500 hover:text-red-600">Logout</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
               <button
                 onClick={() => setActiveManagementTab('papers')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'papers' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Papers
               </button>
               <button
                 onClick={() => setActiveManagementTab('events')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'events' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Events
               </button>
               <button
                 onClick={() => setActiveManagementTab('conferences')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'conferences' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Conferences
               </button>
               <button
                 onClick={() => setActiveManagementTab('faqs')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'faqs' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 FAQs
               </button>
            </div>

            <div className="p-8">
              {activeManagementTab === 'papers' && <PaperManagement papers={papers} setPapers={setPapers} />}
              {activeManagementTab === 'events' && (loadingEvents ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" /> : <EventManagement initialEvents={events} />)}
              {activeManagementTab === 'conferences' && (loadingConferences ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" /> : <ConferenceManagement initialConferences={conferences} />)}
              {activeManagementTab === 'faqs' && (loadingFaqs ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" /> : <FAQManagement initialFaqs={faqs} />)}
            </div>
          </div>
        </div>
      </div>
    );
};

// --- Updated Membership Page with Mock Stripe ---

const MembershipPage: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);


  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming newsletterEmail is the state variable holding the email
    if (!newsletterEmail) return;

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: newsletterEmail });

    if (error) {
      alert('Subscription failed');
      console.error('Supabase subscription error:', error);
    } else {
      alert('Subscribed successfully! Please check your email.');
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 3000);
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Get Involved</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Become part of a community working to improve education in Ontario.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
                <p className="text-lg text-slate-700 leading-relaxed">
                    Join a dynamic community committed to advancing educational practice across Ontario. By subscribing to our mailing list, you will gain timely updates on research findings, access to curated resources and data, and opportunities to participate in conferences, workshops, and professional gatherings. Our network fosters collaboration among educators, researchers, and stakeholders, supporting knowledge sharing and informed decision-making to strengthen teaching and learning. Stay connected and engaged with initiatives that aim to improve learning outcomes and educational equity for all.
                </p>
            </div>
        </div>

        {/* Mailing List Subscription */}
        <div className="max-w-4xl mx-auto bg-brand-900 rounded-2xl p-8 md:p-12 text-center text-white mb-20 mt-8">
            <div className="flex justify-center mb-6">
                <div className="bg-brand-800 p-4 rounded-full">
                    <Mail className="h-8 w-8 text-brand-300" />
                </div>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Subscribe to our Mailing List</h2>
            <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive latest updates.
            </p>
            {newsletterSuccess ? (
                <div className="bg-green-500/20 border border-green-500/50 text-green-100 px-6 py-4 rounded-lg inline-flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <span>Subscribed successfully! Check your inbox.</span>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
                        <input 
                            type="email" 
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Enter your email address" 
                            className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400" 
                        />
                        <button type="submit" className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-brand-300">
                        To cancel subscription please contact us at contact@oerc.ca
                    </p>
                </div>
            )}
        </div>
        
      </div>
      
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Privacy Policy</h2>
                <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X className="h-5 w-5 text-slate-500" />
                </button>
             </div>
             
             {/* Content */}
             <div className="p-6 md:p-10 overflow-y-auto">
                <PrivacyPolicyContent />
             </div>

             {/* Footer */}
             <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  Close & Continue Registration
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Contact: React.FC = () => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Contact Us</h1>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
         {/* Image Section */}
         <div className="md:w-1/2 h-64 md:h-auto">
            <img 
              src="https://picsum.photos/seed/oerc_office/800/800" 
              alt="OERC Office" 
              className="w-full h-full object-cover"
            />
         </div>

         {/* Info Section */}
         <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-8">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Get in Touch</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We are always looking to collaborate with educators and researchers. Reach out to us for general inquiries or partnership opportunities.
                  </p>
                  
                  <div className="flex items-center text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <Mail className="h-5 w-5 mr-3 text-brand-600" />
                     <span className="font-medium">contact@oerc.ca</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      const data = await getFaqs();
      setFaqs(data);
      setLoading(false);
    };
    loadFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h1>
        <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
          Common questions about our consortium, research access, and membership benefits.
        </p>
        
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
            <p className="text-slate-500 mt-2">Loading FAQs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                >
                  <span className={`font-bold text-lg ${openIndex === index ? 'text-brand-700' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-brand-600 shrink-0 ml-4" />
                  ) : (
                    <Plus className="h-5 w-5 text-slate-400 shrink-0 ml-4" />
                  )}
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Still need help?</h3>
          <p className="text-slate-600 mb-4">Contact us at contact@oerc.ca</p>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalConferences, setGlobalConferences] = useState<GlobalConference[]>([]);
  const [loadingGlobalConferences, setLoadingGlobalConferences] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  useEffect(() => {
    const loadGlobalConferences = async () => {
      setLoadingGlobalConferences(true);
      const data = await getGlobalConferences();
      console.log('Fetched global events data:', data); // Add this log
      setGlobalConferences(data);
      setLoadingGlobalConferences(false);
    }
    loadGlobalConferences();
  }, []);

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Upcoming Events</h1>
        
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
            <p className="text-slate-500 mt-2">Loading Events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* OERC Events */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-200 pb-2">
                <Calendar className="h-6 w-6 mr-2 text-brand-600" />
                OERC Events
              </h2>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-600 mb-6">
                <p>OERC shares information about educational events, workshops, and learning opportunities that may be of interest to educators and the wider community. These include activities hosted by OERC as well as selected events from external organizations.</p>
              </div>
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                      <div className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shrink-0 ml-4">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed flex-grow">{event.description}</p>
                    <div className="flex items-center text-sm text-slate-500 mb-6">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="mt-auto border-t border-slate-100 pt-4 flex justify-end">
                      <button 
                        onClick={() => setCurrentPage(Page.MEMBERSHIP)}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-slate-500 italic">No upcoming OERC events scheduled.</p>}
              </div>
            </div>

            {/* Global Events */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center border-b border-slate-200 pb-2">
                <Globe className="h-6 w-6 mr-2 text-brand-600" />
                Global Events
              </h2>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-600 mb-6 text-sm">
                <p>Some events listed may be hosted by external organizations. For more information, you will be redirected to their websites.</p>
              </div>
              {loadingGlobalConferences ? (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
                  <p className="text-slate-500 mt-2">Loading Global Events...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl text-xs font-bold uppercase text-slate-500">
                      <div className="col-span-2">Event</div>
                      <div>Date</div>
                      <div>Location</div>
                  </div>
                  {/* Table Body */}
                  <div className="divide-y divide-slate-100">
                      {globalConferences.map((conf) => (
                          conf.link ? (
                              <a
                                  key={conf.id}
                                  href={conf.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50 transition-colors group"
                              >
                                  <div className="col-span-2">
                                      <p className="font-bold text-slate-900 group-hover:text-brand-700">{conf.title}</p>
                                      <p className="text-sm text-slate-600 mt-1">{conf.description}</p>
                                  </div>
                                  <div className="text-sm text-slate-700">
                                      {new Date(conf.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </div>
                                  <div className="text-sm text-slate-700">{conf.location}</div>
                              </a>
                          ) : (
                              <div
                                  key={conf.id}
                                  className="grid grid-cols-4 gap-4 p-4 group" // No hover effect or pointer for non-clickable
                              >
                                  <div className="col-span-2">
                                      <p className="font-bold text-slate-900">{conf.title}</p>
                                      <p className="text-sm text-slate-600 mt-1">{conf.description}</p>
                                  </div>
                                  <div className="text-sm text-slate-700">
                                      {new Date(conf.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </div>
                                  <div className="text-sm text-slate-700">{conf.location}</div>
                              </div>
                          )
                      ))}
                  </div>
                </div>
              )}
              {globalConferences.length === 0 && !loadingGlobalConferences && (
                <p className="text-slate-500 italic mt-6">No global events scheduled.</p>
              )}
            </div>          </div>
        )}

        <div className="mt-16 bg-brand-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-serif font-bold mb-4">Host an Event?</h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Educators, organizations, and partners are welcome to suggest workshops or submit events to be considered for our calendar. If you are interested in sharing an event, please contact our coordination team.
          </p>
          <button className="bg-white text-brand-900 font-bold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
            Submit Event Proposal
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          <p>For questions regarding events or submissions, please contact our coordination team at <a href="mailto:contact@oerc.ca" className="text-brand-600 hover:underline">contact@oerc.ca</a></p>
        </div>
      </div>
    </div>
  );
};

import { Routes, Route, useLocation } from 'react-router-dom';
//... (keep existing imports)

// ... (keep existing page components)

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  // Lift paper state to App level so Admin changes reflect across the app
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null); // New state for current user
  const location = useLocation();

  useEffect(() => {
    // Load initial papers from Supabase
    getPapers().then(data => {
      setPapers(data);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user || null);
      }
    );

    // Initial check for current user, in case onAuthStateChange doesn't fire immediately
    getCurrentUser().then(user => {
      setCurrentUser(user);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/admin') {
      // You can add logic here if you want to do something when admin route is accessed
    } else {
      // Reset to home or other default page when not on admin route
      // setCurrentPage(Page.HOME);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case Page.HOME: return <Home setCurrentPage={setCurrentPage} setSelectedPaperId={setSelectedPaperId} papers={papers} />;
      case Page.ABOUT: return <About />;
      case Page.RESEARCH: return <ResearchPage initialPapers={papers} setPapers={setPapers} selectedPaperId={selectedPaperId} onClearSelectedPaper={() => setSelectedPaperId(null)} />;
      case Page.EVENTS: return <EventsPage setCurrentPage={setCurrentPage} />;
      case Page.MEMBERSHIP: return <MembershipPage />;
      case Page.CONTACT: return <Contact />;
      case Page.PRIVACY: return <PrivacyPolicyPage />;
      default: return <Home setCurrentPage={setCurrentPage} setSelectedPaperId={setSelectedPaperId} papers={papers} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onSignOut={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/admin" element={<DashboardPage papers={papers} setPapers={setPapers} currentUser={currentUser} setCurrentUser={setCurrentUser} onSignOut={handleLogout} />} />
          <Route path="/*" element={renderMainContent()} />
        </Routes>
      </main>
      <Footer onNavigate={setCurrentPage} onShowFaqModal={() => setShowFaqModal(true)} />

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowFaqModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Frequently Asked Questions</h2>
                <button onClick={() => setShowFaqModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X className="h-5 w-5 text-slate-500" />
                </button>
             </div>
             
             {/* Content */}
             <div className="p-6 md:p-10 overflow-y-auto">
                <FAQPage />
             </div>

             {/* Footer */}
             <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                <button 
                  onClick={() => setShowFaqModal(false)}
                  className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  Close
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;