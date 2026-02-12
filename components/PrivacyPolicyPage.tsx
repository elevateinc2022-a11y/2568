import React from 'react';
import PrivacyPolicyContent from './PrivacyPolicyContent';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6 text-center">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
          <PrivacyPolicyContent />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
