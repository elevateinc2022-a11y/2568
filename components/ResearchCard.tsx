import React from 'react';
import { ResearchPaper } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface ResearchCardProps {
  paper: ResearchPaper;
  onClick: (paper: ResearchPaper) => void;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ paper, onClick }) => {
  return (
    <div 
      onClick={() => onClick(paper)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full group cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={paper.imageUrl || "https://picsum.photos/seed/default/800/400"} 
          alt={paper.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {paper.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-700 transition-colors">
          {paper.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
          {paper.abstract}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {paper.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(paper.date.replace(/-/g, '/')).toLocaleDateString()}
          </div>
        </div>
        <button className="mt-4 w-full py-2 flex items-center justify-center text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors text-sm">
          Read Paper <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ResearchCard;