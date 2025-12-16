import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentUser: any | null; // New prop for current user
  onSignOut: () => void; // New prop for sign out handler
}

interface NavItem {
  label: string;
  value: Page | 'dashboard' | 'signOutButton';
  action?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, currentUser, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const baseNavItems: NavItem[] = [
    { label: 'Home', value: Page.HOME },
    { label: 'About', value: Page.ABOUT },
    { label: 'Research', value: Page.RESEARCH },
    { label: 'Events', value: Page.EVENTS },
    { label: 'Get Involved', value: Page.MEMBERSHIP },

    { label: 'Contact', value: Page.CONTACT },
  ];

  const finalNavItems: NavItem[] = [...baseNavItems];

  if (currentUser) {
    finalNavItems.push({ label: 'Dashboard', value: 'dashboard', action: () => window.location.href = '/admin' });
    finalNavItems.push({ label: 'Sign Out', value: 'signOutButton', action: onSignOut }); // Use a unique value for key
  }

  const navItems = finalNavItems;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(Page.HOME)}>
            <GraduationCap className="h-10 w-10 text-brand-700" />
            <div className="ml-3">
              <span className="block text-xl font-bold text-brand-900 tracking-tight leading-none">OERC</span>
              <span className="block text-xs font-medium text-brand-600 uppercase tracking-widest">Ontario Educational Research Consortium</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => (item.action ? item.action() : onNavigate(item.value as Page))}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.value
                    ? 'text-brand-700 border-b-2 border-brand-700'
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-brand-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    onNavigate(item.value as Page);
                  }
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.value
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-slate-600 hover:text-brand-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;