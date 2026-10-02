import React from 'react';
import { Mail } from 'lucide-react';

const Contact: React.FC = () => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Contact Us</h1>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
         <div className="md:w-1/2 h-64 md:h-auto">
            <img 
              src={import.meta.env.BASE_URL + 'images/contact.png'} 
              alt="OERC Office" 
              className="w-full h-full object-cover"
            />
         </div>

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

export default Contact;