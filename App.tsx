import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardPage from './components/DashboardPage';
import Home from './components/Home';
import About from './components/About';
import ResearchPage from './components/ResearchPage';
import EventsPage from './components/EventsPage';
import MembershipPage from './components/MembershipPage';
import Contact from './components/Contact';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import FAQPage from './components/FAQPage';

import { getPapers, signOut, getCurrentUser } from './services/supabaseService';
import { supabase } from './supabaseClient';
import { ResearchPaper } from './types';

const App: React.FC = () => {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getPapers().then(data => {
      setPapers(data);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user || null);
      }
    );

    getCurrentUser().then(user => {
      setCurrentUser(user);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    navigate('/');
  };

  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {!isAdminPage && <Navbar currentUser={currentUser} onSignOut={handleLogout} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/admin" element={<DashboardPage papers={papers} setPapers={setPapers} currentUser={currentUser} setCurrentUser={setCurrentUser} onSignOut={handleLogout} />} />
          <Route path="/" element={<Home setSelectedPaperId={setSelectedPaperId} papers={papers} />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<ResearchPage initialPapers={papers} selectedPaperId={selectedPaperId} onSelectPaper={(id) => setSelectedPaperId(id)} onClearSelectedPaper={() => setSelectedPaperId(null)} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;