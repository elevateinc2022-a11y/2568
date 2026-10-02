import React from 'react';

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

export default About;