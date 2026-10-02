import React, { useState } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import PrivacyPolicyContent from './PrivacyPolicyContent';

const MembershipPage: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Privacy Policy</h2>
                <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X className="h-5 w-5 text-slate-500" />
                </button>
             </div>
             
             <div className="p-6 md:p-10 overflow-y-auto">
                <PrivacyPolicyContent />
             </div>

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

export default MembershipPage;