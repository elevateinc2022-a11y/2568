import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Play, Pause, User, Calendar, BookOpen, Users, BarChart3, Bot, Loader2 } from 'lucide-react';
import { ResearchPaper } from '../types';

interface HomeProps {
  setSelectedPaperId: (id: string | null) => void;
  papers: ResearchPaper[];
}

const Home: React.FC<HomeProps> = ({ setSelectedPaperId, papers }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const featured = papers.slice(0, 4);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && featured.length > 0) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % featured.length);
      }, 5000);
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
            <img src={import.meta.env.BASE_URL + 'images/background.png'} alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:w-2/3">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Advancing Education Through <span className="text-brand-400">Evidence and Innovation</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Dedicated to advancing educational practices in Ontario through rigorous research, collaboration, and data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/research')} className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-brand-500/30 transition-all duration-300 flex items-center justify-center">
                Explore Research <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button onClick={() => navigate('/about')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg transition-all duration-300">
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
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                {isPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
                {isPaused ? "Resume" : "Pause Pan"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[225px]">
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

                <p key={`abs-${currentPaper.id}`} className="text-slate-600 text-lg leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 line-clamp-3">
                   {currentPaper.abstract}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button onClick={() => { navigate('/research'); setSelectedPaperId(currentPaper.id); }} className="text-brand-700 font-semibold hover:text-brand-800 transition-colors flex items-center">
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

export default Home;