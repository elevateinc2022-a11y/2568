import React, { useState, useEffect } from 'react';
import { Loader2, Minus, Plus } from 'lucide-react';
import { getFaqs } from '../services/supabaseService';
import { FAQ } from '../types';

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

export default FAQPage;