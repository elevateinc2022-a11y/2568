import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Added NavLink and useNavigate
import { Page } from '../types';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentUser: any | null;
  onSignOut: () => void;
}

interface NavItem {
  label: string;
  value: string | 'signOutButton'; // Changed to string for paths
  action?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getPagePath = (page: Page): string => {
    switch (page) {
      case Page.HOME: return '/#/';
      case Page.ABOUT: return '/#/about';
      case Page.RESEARCH: return '/#/research';
      case Page.EVENTS: return '/#/events';
      case Page.MEMBERSHIP: return '/#/membership';
      case Page.CONTACT: return '/#/contact';
      case Page.PRIVACY: return '/#/privacy';
      case Page.FAQ: return '/#/faq'; // Assuming FAQ will be its own page route
      default: return '/#/';
    }
  };

  const baseNavItems: NavItem[] = [
    { label: 'Home', value: getPagePath(Page.HOME) },
    { label: 'About', value: getPagePath(Page.ABOUT) },
    { label: 'Research', value: getPagePath(Page.RESEARCH) },
    { label: 'Events', value: getPagePath(Page.EVENTS) },
    { label: 'Get Involved', value: getPagePath(Page.MEMBERSHIP) },
    { label: 'Contact', value: getPagePath(Page.CONTACT) },
    { label: 'FAQ', value: getPagePath(Page.FAQ) }, // Added FAQ
  ];

  const finalNavItems: NavItem[] = [...baseNavItems];

  if (currentUser) {
    finalNavItems.push({ label: 'Dashboard', value: '/#/admin', action: () => navigate('/admin') });
    finalNavItems.push({ label: 'Sign Out', value: 'signOutButton', action: onSignOut });
  }

  const navItems = finalNavItems;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/#/')}>
            <img src={'images/my_logo.png.png'} alt="OERC Logo" className="h-10 w-10 object-contain" />
            <div className="ml-3">
              <span className="block text-xl font-bold text-brand-900 tracking-tight leading-none">OERC</span>
              <span className="block text-xs font-medium text-brand-600 uppercase tracking-widest">Ontario Educational Research Consortium</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              item.action ? (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-sm font-medium transition-colors duration-200 text-slate-600 hover:text-brand-600"
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.value as string}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-brand-700 border-b-2 border-brand-700'
                        : 'text-slate-600 hover:text-brand-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
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
              item.action ? (
                <button
                  key={item.label}
                  onClick={() => { item.action && item.action(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-brand-600"
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.value as string}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-slate-600 hover:text-brand-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;