import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6 text-center">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12 text-slate-700 leading-relaxed">
          <p>This is a placeholder for the Privacy Policy content. Details about data collection, usage, and protection will be provided here.</p>
          <p className="mt-4">Please check back later for the full policy.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
