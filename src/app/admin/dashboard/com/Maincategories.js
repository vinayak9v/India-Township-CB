"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';

export default function Maincategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', status: 'ACTIVE' });
  const [isEditing, setIsEditing] = useState(null);

  // 1. Fetch Categories (GET)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/main-categories');
      const result = await res.json();
      if (result.success) setCategories(result.data);
    } catch (err) { 
      console.error(err); 
    }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  // 2. Add / Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `/api/admin/main-categories/${isEditing}` 
      : '/api/admin/main-categories';
      
    await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    setFormData({ name: '', slug: '', status: 'ACTIVE' });
    setIsEditing(null);
    fetchCategories();
  };

  // 3. Delete Category
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/admin/main-categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">Main Categories</h2>
        <p className="text-sm text-slate-500 mt-1">Manage and organize your top-level property categories.</p>
      </div>

      <div className="p-6">
        {/* Form Section */}
        <div className="mb-8 bg-slate-50/50 border border-slate-100 rounded-lg p-5">
          <h3 className="text-sm font-medium text-slate-800 mb-4">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
            <input 
              required
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors flex-1 w-full sm:min-w-[200px]"
              placeholder="Category Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              required
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors flex-1 w-full sm:min-w-[200px]"
              placeholder="Slug (e.g., residential-plots)"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
            />
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                type="submit"
                className="w-full sm:w-auto bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
              >
                {isEditing ? <Save className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
                {isEditing ? 'Update Category' : 'Add Category'}
              </button>
              
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ name: '', slug: '', status: 'ACTIVE' });
                  }} 
                  className="px-4 py-2 text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4"/> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <Loader2 className="animate-spin w-8 h-8 mb-2"/>
              <span className="text-sm">Loading categories...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Category Name</th>
                    <th className="px-6 py-3">Slug</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-100 bg-white">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                        No categories found. Add one above.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                        <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            cat.status === 'ACTIVE' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {cat.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setIsEditing(cat.id); setFormData(cat); }} 
                              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4"/>
                            </button>
                            <button 
                              onClick={() => handleDelete(cat.id)} 
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}