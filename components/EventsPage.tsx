import React, { useState, useEffect } from 'react';
import { Calendar, Globe, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEvents, getGlobalConferences } from '../services/supabaseService';
import { Event, GlobalConference } from '../types';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalConferences, setGlobalConferences] = useState<GlobalConference[]>([]);
  const [loadingGlobalConferences, setLoadingGlobalConferences] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  useEffect(() => {
    const loadGlobalConferences = async () => {
      setLoadingGlobalConferences(true);
      const data = await getGlobalConferences();
      setGlobalConferences(data);
      setLoadingGlobalConferences(false);
    }
    loadGlobalConferences();
  }, []);

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Upcoming Events</h1>
        
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
            <p className="text-slate-500 mt-2">Loading Events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* OERC Events */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-200 pb-2">
                <Calendar className="h-6 w-6 mr-2 text-brand-600" />
                OERC Events
              </h2>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-600 mb-6">
                <p>OERC shares information about educational events, workshops, and learning opportunities that may be of interest to educators and the wider community. These include activities hosted by OERC as well as selected events from external organizations.</p>
              </div>
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                      <div className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shrink-0 ml-4">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed flex-grow">{event.description}</p>
                    <div className="flex items-center text-sm text-slate-500 mb-6">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="mt-auto border-t border-slate-100 pt-4 flex justify-end">
                      <button 
                        onClick={() => navigate('/membership')}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-slate-500 italic">No upcoming OERC events scheduled.</p>}
              </div>
            </div>

            {/* Global Events */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center border-b border-slate-200 pb-2">
                <Globe className="h-6 w-6 mr-2 text-brand-600" />
                Global Events
              </h2>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-600 mb-6 text-sm">
                <p>Some events listed may be hosted by external organizations. For more information, you will be redirected to their websites.</p>
              </div>
              {loadingGlobalConferences ? (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
                  <p className="text-slate-500 mt-2">Loading Global Events...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl text-xs font-bold uppercase text-slate-500">
                      <div className="col-span-2">Event</div>
                      <div>Date</div>
                      <div>Location</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                      {globalConferences.map((conf) => (
                          conf.link ? (
                              <a
                                  key={conf.id}
                                  href={conf.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50 transition-colors group"
                              >
                                  <div className="col-span-2">
                                      <p className="font-bold text-slate-900 group-hover:text-brand-700">{conf.title}</p>
                                      <p className="text-sm text-slate-600 mt-1">{conf.description}</p>
                                  </div>
                                  <div className="text-sm text-slate-700">
                                      {new Date(conf.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </div>
                                  <div className="text-sm text-slate-700">{conf.location}</div>
                              </a>
                          ) : (
                              <div
                                  key={conf.id}
                                  className="grid grid-cols-4 gap-4 p-4 group"
                              >
                                  <div className="col-span-2">
                                      <p className="font-bold text-slate-900">{conf.title}</p>
                                      <p className="text-sm text-slate-600 mt-1">{conf.description}</p>
                                  </div>
                                  <div className="text-sm text-slate-700">
                                      {new Date(conf.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </div>
                                  <div className="text-sm text-slate-700">{conf.location}</div>
                              </div>
                          )
                      ))}
                  </div>
                </div>
              )}
              {globalConferences.length === 0 && !loadingGlobalConferences && (
                <p className="text-slate-500 italic mt-6">No global events scheduled.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-16 bg-brand-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-serif font-bold mb-4">Host an Event?</h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Educators, organizations, and partners are welcome to suggest workshops or submit events to be considered for our calendar. If you are interested in sharing an event, please contact our coordination team.
          </p>
          <a href="https://forms.gle/6tuWMRaN3JZUPGF26" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-900 font-bold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
            Submit Event Proposal
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          <p>For questions regarding events or submissions, please contact our coordination team at <a href="mailto:contact@oerc.ca" className="text-brand-600 hover:underline">contact@oerc.ca</a></p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;