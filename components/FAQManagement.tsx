import React, { useState, useEffect } from 'react';
import { FAQ } from '../types';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../services/supabaseService';
import { Loader2, Edit, Trash2 } from 'lucide-react';

interface FAQManagementProps {
  initialFaqs: FAQ[];
}

const FAQManagement: React.FC<FAQManagementProps> = ({ initialFaqs }) => {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list'); // 'list' to show faqs, 'form' to add/edit
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      const fetchedFaqs = await getFaqs();
      setFaqs(fetchedFaqs);
      setLoading(false);
    };
    loadFaqs();
  }, []);

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setEditingFaq(null);
    setActiveTab('list');
  };

  const handleEditClick = (faq: FAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setActiveTab('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const faqData = { question, answer };
    let success = false;

    if (editingFaq) {
      const updated = await updateFaq(editingFaq.id, faqData);
      if (updated) {
        setFaqs(prev => prev.map(f => f.id === updated.id ? updated : f));
        success = true;
      }
    } else {
      const created = await createFaq(faqData);
      if (created) {
        setFaqs(prev => [...prev, created]);
        success = true;
      }
    }

    if (success) {
      alert(editingFaq ? 'FAQ updated successfully!' : 'FAQ created successfully!');
      resetForm();
    } else {
      alert('Failed to save FAQ.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setLoading(true);
      const success = await deleteFaq(id);
      if (success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        alert('FAQ deleted successfully!');
      } else {
        alert('Failed to delete FAQ.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => resetForm()}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'list' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Manage FAQs
        </button>
        <button
          onClick={() => { setEditingFaq(null); setActiveTab('form'); }}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'form' && !editingFaq ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Add New FAQ
        </button>
        {editingFaq && (
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'form' && editingFaq ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Edit FAQ
          </button>
        )}
      </div>

      <div className="p-8">
        {activeTab === 'list' ? (
          loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-slate-100">
                    <th className="py-3 font-medium">Question</th>
                    <th className="py-3 font-medium">Answer</th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-500 italic">No FAQs found.</td>
                    </tr>
                  ) : (
                    faqs.map(faq => (
                      <tr key={faq.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 pr-4 font-medium text-slate-900">{faq.question}</td>
                        <td className="py-4 text-slate-600">{faq.answer.substring(0, 70)}...</td>
                        <td className="py-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(faq)}
                            className="text-brand-500 hover:text-brand-700 p-2 hover:bg-brand-50 rounded"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Question</label>
              <input
                type="text"
                required
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Answer</label>
              <textarea
                rows={6}
                required
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (editingFaq ? 'Update FAQ' : 'Create FAQ')}
            </button>
            {editingFaq && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="w-full mt-4 text-slate-600 hover:text-slate-800"
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default FAQManagement;
