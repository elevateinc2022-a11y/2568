import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Trash2, Mail, Users } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const SubscribersManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-subscribers');
      if (error) {
        throw error;
      }
      setSubscribers(data as Subscriber[]);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Failed to fetch subscribers.');
    } finally {
      setLoading(false);
    }
  };

  const removeSubscriber = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) {
      return;
    }
    try {
      const { error } = await supabase.functions.invoke('remove-subscriber', {
        body: { id }
      });
      if (error) {
        throw error;
      }
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    } catch (err: any) {
      console.error('Error removing subscriber:', err);
      setError(err.message || 'Failed to remove subscriber.');
    }
  };



  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !htmlContent.trim()) {
      setSendError('Subject and content cannot be empty.');
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('send-bulk-email', {
        body: { subject, htmlContent },
      });

      if (funcError) {
        throw funcError;
      }
      if (data && data.error) { // Custom error from the Edge Function
        throw new Error(data.error);
      }

      setSendSuccess(true);
      setSubject('');
      setHtmlContent('');
      setTimeout(() => setSendSuccess(false), 5000); // Hide success after 5 seconds

    } catch (err: any) {
      console.error('Error sending newsletter:', err);
      setSendError(err.message || 'Failed to send newsletter.');
    } finally {
      setIsSending(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        <p className="ml-3 text-slate-700">Loading subscribers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <button onClick={fetchSubscribers} className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
        <Users className="h-6 w-6 mr-3 text-brand-600" />
        Newsletter Subscribers ({subscribers.length})
      </h2>

      {subscribers.length === 0 ? (
        <div className="text-center p-8 bg-slate-50 rounded-lg">
          <p className="text-slate-600 italic">No subscribers found yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Subscribed On
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeSubscriber(subscriber.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Newsletter Send Section */}
      <div className="mt-12 p-6 bg-brand-50 border border-brand-200 rounded-lg">
        <h3 className="text-xl font-bold text-brand-900 mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-brand-700" /> Send Newsletter/Update
        </h3>
        <p className="text-brand-800 text-sm mb-4">
          Compose and send an email to all current newsletter subscribers.
        </p>
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-brand-800 mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Newsletter Subject"
              required
            />
          </div>
          <div>
            <label htmlFor="htmlContent" className="block text-sm font-medium text-brand-800 mb-1">Email Content (HTML)</label>
            <textarea
              id="htmlContent"
              rows={8}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm font-mono"
              placeholder="Enter HTML content for your newsletter..."
              required
            ></textarea>
          </div>
          {sendError && (
            <div className="text-red-700 bg-red-100 border border-red-200 p-3 rounded-md text-sm">
              Error: {sendError}
            </div>
          )}
          {sendSuccess && (
            <div className="text-green-700 bg-green-100 border border-green-200 p-3 rounded-md text-sm">
              Newsletter sent successfully!
            </div>
          )}
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Mail className="h-5 w-5 mr-2" />
            )}
            {isSending ? 'Sending...' : 'Send Newsletter to All Subscribers'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribersManagement;