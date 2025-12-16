import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onShowFaqModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onShowFaqModal }) => {
  return (
    <footer className="bg-brand-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">OERC</h3>
            <p className="text-brand-100 text-sm leading-relaxed">
              Dedicated to advancing educational practices in Ontario through rigorous research, collaboration, and data-driven insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-brand-100">
              <li onClick={() => onNavigate(Page.MEMBERSHIP)} className="hover:text-white cursor-pointer transition-colors">Get Involved</li>
              <li onClick={() => onNavigate(Page.RESEARCH)} className="hover:text-white cursor-pointer transition-colors">Research</li>
              <li onClick={onShowFaqModal} className="hover:text-white cursor-pointer transition-colors">FAQ's</li>
              <li onClick={() => onNavigate(Page.PRIVACY)} className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-brand-100">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>1815 Sir Isaac Brock Way, St. Catharines, ON</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(905) 555-0123</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@oerc.ca</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-300">
          <p>&copy; {new Date().getFullYear()} Ontario Educational Research Consortium. All rights reserved.</p>
                            </div>
      </div>
    </footer>
  );
};

export default Footer;