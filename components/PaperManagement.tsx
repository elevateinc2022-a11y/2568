import React, { useState } from 'react';
import { ResearchPaper } from '../types';
import { uploadPaperToLibrary, deletePaper, updatePaper } from '../services/supabaseService';
import { Loader2, Trash2, Upload, Image as ImageIcon, Edit } from 'lucide-react';


interface PaperManagementProps {
  papers: ResearchPaper[];
  setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>;
}

const PaperManagement: React.FC<PaperManagementProps> = ({ papers, setPapers }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newFile) return;

    setUploading(true);
    
    // Parse tags from comma separated string
    const tagsArray = newTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Use today's date if no date is selected
    const finalDate = newDate || new Date().toISOString().split('T')[0];

    // Call Supabase Service
    const uploadedPaper = await uploadPaperToLibrary(newTitle, newAuthor, newAbstract, newFile, newImage, tagsArray, finalDate);

    if (uploadedPaper) {
      setPapers(prev => [uploadedPaper, ...prev]);
      alert("Paper uploaded successfully!");
      setNewTitle('');
      setNewAuthor('');
      setNewAbstract('');
      setNewTags('');
      setNewDate('');
      setNewFile(null);
      setNewImage(null);
      setActiveTab('list');
    } else {
      alert("Failed to upload paper. Ensure you are logged in and file is valid.");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this paper? This will also delete associated files.")) {
      const success = await deletePaper(id);
      if (success) {
        setPapers(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete paper.");
      }
    }
  };

  const handleEditClick = (paper: ResearchPaper) => {
    setEditingPaper(paper);
    setNewTitle(paper.title);
    setNewAuthor(paper.author);
    setNewAbstract(paper.abstract);
    setNewTags(paper.tags ? paper.tags.join(', ') : '');
    setNewDate(new Date(paper.date).toISOString().split('T')[0]);
    // Files cannot be pre-filled, user will need to re-upload if needed
    setNewFile(null); 
    setNewImage(null);
    setActiveTab('upload'); // Switch to upload/edit form
  };

  const handleUpdatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaper || !newTitle || !newAuthor) return;

    setUploading(true);
    const tagsArray = newTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const finalDate = newDate || new Date().toISOString().split('T')[0];

    const updatedPaper = await updatePaper(
      editingPaper.id,
      {
        title: newTitle,
        author: newAuthor,
        abstract: newAbstract,
        tags: tagsArray,
        date: finalDate,
        pdfUrl: editingPaper.pdfUrl, // Keep existing if not new file
        imageUrl: editingPaper.imageUrl, // Keep existing if not new file
      },
      newFile,
      newImage
    );

    if (updatedPaper) {
      setPapers(prev => prev.map(p => p.id === updatedPaper.id ? updatedPaper : p));
      alert("Paper updated successfully!");
      setEditingPaper(null);
      setNewTitle('');
      setNewAuthor('');
      setNewAbstract('');
      setNewTags('');
      setNewDate('');
      setNewFile(null);
      setNewImage(null);
      setActiveTab('list');
    } else {
      alert("Failed to update paper.");
    }
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => { setActiveTab('list'); setEditingPaper(null); }}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'list' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Manage Papers
        </button>
        <button 
          onClick={() => { setActiveTab('upload'); setEditingPaper(null); }}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'upload' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          {editingPaper ? "Edit Paper" : "Upload New Paper"}
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-100">
                  <th className="py-3 font-medium">Title</th>
                  <th className="py-3 font-medium">Author</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map(paper => (
                  <tr key={paper.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-4 pr-4 font-medium text-slate-900">{paper.title}</td>
                    <td className="py-4 text-slate-600">{paper.author}</td>
                    <td className="py-4 text-slate-500 text-sm">{new Date(paper.date.replace(/-/g, '/')).toLocaleDateString()}</td>
                    <td className="py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(paper)}
                        className="text-brand-500 hover:text-brand-700 p-2 hover:bg-brand-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(paper.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <form onSubmit={editingPaper ? handleUpdatePaper : handleUpload} className="max-w-2xl mx-auto space-y-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Paper Title</label>
               <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
               <input required value={newAuthor} onChange={e => setNewAuthor(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Publication Date</label>
               <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Abstract</label>
               <textarea required rows={4} value={newAbstract} onChange={e => setNewAbstract(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Paper PDF {editingPaper && "(Upload to replace)"}</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors h-32 flex flex-col items-center justify-center">
                        <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={e => setNewFile(e.target.files ? e.target.files[0] : null)}
                            className="hidden" 
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <Upload className="h-6 w-6 text-brand-400 mb-2" />
                            <span className="text-brand-600 font-medium hover:underline text-sm">Upload PDF</span>
                            {newFile && <span className="text-xs text-green-600 mt-1 font-medium truncate max-w-[200px]">{newFile.name}</span>}
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image (Optional) {editingPaper && "(Upload to replace)"}</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors h-32 flex flex-col items-center justify-center">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setNewImage(e.target.files ? e.target.files[0] : null)}
                            className="hidden" 
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <ImageIcon className="h-6 w-6 text-brand-400 mb-2" />
                            <span className="text-brand-600 font-medium hover:underline text-sm">Upload Image</span>
                            {newImage && <span className="text-xs text-green-600 mt-1 font-medium truncate max-w-[200px]">{newImage.name}</span>}
                        </label>
                    </div>
                </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Comma Separated)</label>
               <input value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="e.g. Literacy, STEM, Policy" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center"
            >
              {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : (editingPaper ? "Update Paper" : "Upload to Library")}
            </button>
            {editingPaper && (
              <button 
                type="button" 
                onClick={() => { setEditingPaper(null); setActiveTab('list'); }}
                className="w-full mt-4 text-slate-600 hover:text-slate-800"
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

export default PaperManagement;
