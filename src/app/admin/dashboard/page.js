"use client";
    
import React, { useState } from 'react';
import { 
  LayoutDashboard, Building2, Users, FileText, Settings, 
  Search, Bell, Mail, ChevronDown, CheckCircle, Clock, 
  TrendingUp, TrendingDown, Eye, Edit, Trash2, ChevronLeft,
  ChevronRight, Plus, ShieldCheck, PieChart, MoreHorizontal,
  Menu, ArrowRight, Home, X, MessageSquare
} from 'lucide-react';
import Maincategories from './com/Maincategories';
import Projectcategories from './com/Projectcategories';
import Properties from './com/Properties';
import LatestFeaturedProperties from './com/LatestFeaturedProperties'; // Added Import
import LuxuryProperties from './com/LuxuryProperties';
import TopResidentialProjects from './com/TopResidentialProjects';
import ContactMessages from './com/ContactMessages';
import UsersManagement from './com/Users';
import Leads from './com/Leads';
import Inquiries from './com/Inquiries';


export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(true);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectView = (view) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex text-slate-800">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* =========================================
          LEFT SIDEBAR (Fixed Width)
          ========================================= */}
      <aside
        className={`w-[260px] bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-screen fixed top-0 left-0 z-50 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-slate-900 tracking-wide uppercase">IndianTownship</span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 no-scrollbar">
          
          <div className="space-y-1">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); selectView('Dashboard'); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                activeView === 'Dashboard' 
                  ? 'bg-slate-100 text-slate-900 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </a>
          </div>

          {/* Property Management Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Property Management
            </h3>
            <div className="space-y-1">
              {/* Dropdown Toggle */}
              <div 
                onClick={() => setIsPropertyMenuOpen(!isPropertyMenuOpen)}
                className="flex items-center justify-between text-slate-700 px-3 py-2.5 rounded-md text-sm hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 font-medium">
                  <Building2 className="w-4 h-4 text-slate-500" /> Properties
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isPropertyMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Dropdown Links */}
              {isPropertyMenuOpen && (
                <div className="flex flex-col pl-10 pr-3 space-y-1.5 py-1 text-sm">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); selectView('All Properties'); }} 
                    className={`py-1.5 transition-colors ${
                      activeView === 'All Properties' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Main Categories 
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); selectView('Add Categories'); }} 
                    className={`py-1.5 transition-colors ${
                      activeView === 'Add Categories' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Add Categories
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); selectView('Property Approval'); }} 
                    className={`py-1.5 transition-colors ${
                      activeView === 'Property Approval' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Add New Property
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Home Page Management Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
              Home Page
            </h3>
            <div className="space-y-1">
              {/* Dropdown Toggle */}
              <div 
                onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)}
                className="flex items-center justify-between text-slate-700 px-3 py-2.5 rounded-md text-sm hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 font-medium">
                  <Home className="w-4 h-4 text-slate-500" /> Layout Management
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isHomeMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Dropdown Links */}
              {isHomeMenuOpen && (
                <div className="flex flex-col pl-10 pr-3 space-y-1.5 py-1 text-sm">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); selectView('Latest Featured Properties'); }} 
                    className={`py-1.5 transition-colors ${
                      activeView === 'Latest Featured Properties' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Latest Featured Properties
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); selectView('Luxury Properties'); }} 
                    className={`py-1.5 transition-colors ${
                      activeView === 'Luxury Properties' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Luxury Properties
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); selectView('Top Residential Projects'); }} 
                    className={`py-1.5 transition-colors ${
                      activeView === 'Top Residential Projects' ? 'text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Top Residential Projects
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Enquiries Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
              Enquiries
            </h3>
            <div className="space-y-1">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); selectView('Contact Messages'); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeView === 'Contact Messages'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" /> Contact Messages
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); selectView('Leads'); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeView === 'Leads'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Leads
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); selectView('Inquiries'); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeView === 'Inquiries'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Inquiries
              </a>
            </div>
          </div>

           <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
              Users
            </h3>
            <div className="space-y-1">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); selectView('Users'); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeView === 'Users'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" /> Users Management
              </a>
            </div>
          </div>

        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT AREA
          ========================================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-9 h-9 border border-slate-200 text-slate-600 rounded-md flex items-center justify-center hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-4 text-sm outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300"></div>
          </div>
        </header>

        {/* Dashboard Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
          
          {activeView === 'Dashboard' ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Welcome back. Here is an overview of your properties.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                   <p className="text-sm font-medium text-slate-500">Total Properties</p>
                   <p className="text-3xl font-semibold text-slate-900 mt-2">1,284</p>
                 </div>
                 <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                   <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                   <p className="text-3xl font-semibold text-slate-900 mt-2">32</p>
                 </div>
                 <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                   <p className="text-sm font-medium text-slate-500">Total Views</p>
                   <p className="text-3xl font-semibold text-slate-900 mt-2">45.2k</p>
                 </div>
              </div>
            </>
          ) : activeView === 'All Properties' ? (
            <Maincategories />
          ) : activeView === 'Add Categories' ? (
            <Projectcategories />
          ) : activeView === 'Property Approval' ? (
            <Properties />
          ) : activeView === 'Latest Featured Properties' ? (
            <LatestFeaturedProperties />
          ) : activeView === 'Luxury Properties' ? (
            <LuxuryProperties />
          ) : activeView === 'Top Residential Projects' ? (
  <TopResidentialProjects />
          ) : activeView === 'Contact Messages' ? (
            <ContactMessages />
          ) : activeView === 'Leads' ? (
            <Leads />
          ) : activeView === 'Inquiries' ? (
            <Inquiries />
          ) : activeView === 'Users' ? (
            <UsersManagement />
          ) :
           (
            
            /* FALLBACK FOR NEW HOME PAGE LINKS */
            <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl border border-slate-200 shadow-sm p-10">
              <LayoutDashboard className="w-12 h-12 text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-1">{activeView}</h2>
              <p className="text-sm text-slate-500">This layout view is currently under construction.</p>
              <button 
                onClick={() => selectView('Dashboard')}
                className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}