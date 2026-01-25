import React, { useState, useEffect } from 'react';
import PaperManagement from './PaperManagement';
import EventManagement from './EventManagement';
import ConferenceManagement from './ConferenceManagement';
import FAQManagement from './FAQManagement';
import SubscribersManagement from './SubscribersManagement'; // New import
import { getEvents, getFaqs, getGlobalConferences, signIn } from '../services/supabaseService';
import { Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResearchPaper, Event, GlobalConference, FAQ } from '../types';

const DashboardPage: React.FC<{ 
  papers: ResearchPaper[], 
  setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>;
  currentUser: any | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<any | null>>;
  onSignOut: () => void; 
}> = ({ papers, setPapers, currentUser, setCurrentUser, onSignOut }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeManagementTab, setActiveManagementTab] = useState<'papers' | 'events' | 'conferences' | 'faqs' | 'subscribers'>('papers'); // Updated type
  
  const [events, setEvents] = useState<Event[]>([]);
  const [conferences, setConferences] = useState<GlobalConference[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Loading states for each data type
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingConferences, setLoadingConferences] = useState(true);
  const [loadingFaqs, setLoadingFaqs] = useState(true);


  useEffect(() => {
    // currentUser is managed by App.tsx, no need to fetch here again.
    // If currentUser becomes null, it means logout happened from Navbar or elsewhere.
    // If currentUser exists, we are already authenticated.
  }, [currentUser]);

  // Fetch Events
  useEffect(() => {
    if (currentUser && activeManagementTab === 'events') {
      const loadEvents = async () => {
        setLoadingEvents(true);
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
        setLoadingEvents(false);
      };
      loadEvents();
    }
  }, [currentUser, activeManagementTab]);

  // Fetch Conferences
  useEffect(() => {
    if (currentUser && activeManagementTab === 'conferences') {
      const loadConferences = async () => {
        setLoadingConferences(true);
        const fetchedConferences = await getGlobalConferences();
        setConferences(fetchedConferences);
        setLoadingConferences(false);
      };
      loadConferences();
    }
  }, [currentUser, activeManagementTab]);

  // Fetch FAQs
  useEffect(() => {
    if (currentUser && activeManagementTab === 'faqs') {
      const loadFaqs = async () => {
        setLoadingFaqs(true);
        const fetchedFaqs = await getFaqs();
        setFaqs(fetchedFaqs);
        setLoadingFaqs(false);
      };
      loadFaqs();
    }
  }, [currentUser, activeManagementTab]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
    } else {
      setCurrentUser(data.user); // Use setCurrentUser from props
    }
  };
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-100 p-3 rounded-full">
               <Lock className="h-6 w-6 text-brand-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Sign In</h2>
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
              <Link to="/" className="text-sm text-brand-600 hover:underline">Home</Link>
              <Link to="/about" className="text-sm text-brand-600 hover:underline">About</Link>
              <Link to="/research" className="text-sm text-brand-600 hover:underline">Research</Link>
              <Link to="/events" className="text-sm text-brand-600 hover:underline">Events</Link>
              <Link to="/membership" className="text-sm text-brand-600 hover:underline">Get Involved</Link>
              <Link to="/contact" className="text-sm text-brand-600 hover:underline">Contact</Link>
              <Link to="/faq" className="text-sm text-brand-600 hover:underline">FAQ</Link>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm text-slate-500 hidden md:inline">{currentUser.email}</span>
               <button onClick={onSignOut} className="text-slate-500 hover:text-red-600">Logout</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
               <button
                 onClick={() => setActiveManagementTab('papers')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'papers' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Papers
               </button>
               <button
                 onClick={() => setActiveManagementTab('events')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'events' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Events
               </button>
               <button
                 onClick={() => setActiveManagementTab('conferences')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'conferences' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Conferences
               </button>
               <button
                 onClick={() => setActiveManagementTab('faqs')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'faqs' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 FAQs
               </button>
               <button
                 onClick={() => setActiveManagementTab('subscribers')}
                 className={`px-6 py-4 font-medium text-sm ${activeManagementTab === 'subscribers' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 Subscribers
               </button>
            </div>

            <div className="p-8">
              {activeManagementTab === 'papers' && <PaperManagement papers={papers} setPapers={setPapers} />}
              {activeManagementTab === 'events' && (loadingEvents ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" /> : <EventManagement initialEvents={events} />)}
              {activeManagementTab === 'conferences' && (loadingConferences ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" /> : <ConferenceManagement initialConferences={conferences} />)}
              {activeManagementTab === 'faqs' && (loadingFaqs ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" /> : <FAQManagement initialFaqs={faqs} />)}
              {activeManagementTab === 'subscribers' && <SubscribersManagement />}
            </div>
          </div>
        </div>
      </div>
    );
};

export default DashboardPage;
