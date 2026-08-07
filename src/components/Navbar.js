"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Plus, User, Tag, Globe, ChevronDown, Menu, X, UserCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const [navLinks, setNavLinks] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const [navError, setNavError] = useState('');
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const handleAddProperty = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    router.push(token ? '/myProperty' : '/login?redirect=/myProperty');
  };

  const handleProfileClick = () => {
    setMobileMenuOpen(false);
    router.push(user ? '/profile' : '/login?redirect=/profile');
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      const token = localStorage.getItem('authToken');
      if (token && storedUser) setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }

    const fetchNavLinks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/navbarapi`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load navigation links.');
        }

        setNavLinks(data.data || []);
      } catch (err) {
        setNavError(err.message || 'Something went wrong while loading the menu.');
      } finally {
        setNavLoading(false);
      }
    };

    fetchNavLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allNavItems = [
    { id: 'home', name: 'Home', slug: '' },
    ...navLinks,
    { id: 'contact', name: 'Contact Us', slug: 'contact' },
  ];

  return (
    <div className="w-full flex flex-col z-50 sticky top-0">
      {/* Top Bar (Dark Blue) */}
      <div className="w-full bg-[#0d1326] text-gray-200 text-sm hidden lg:block border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          {/* Top Bar Left */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer group">
              <User className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-white hover:text-[#f59e0b] font-medium transition-colors">Become a Member</span>
            </div>
            <span className="w-px h-4 bg-gray-600"></span>
            <div className="flex items-center gap-2 cursor-pointer group">
              <Tag className="w-4 h-4 text-[#f59e0b]" />
              <span className="group-hover:text-[#f59e0b] font-medium transition-colors">Get 10% Off on Your First Booking</span>
            </div>
          </div>

          {/* Top Bar Right */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 cursor-pointer group">
              <Phone className="w-4 h-4" />
              <span className="group-hover:text-[#f59e0b] font-medium transition-colors">+91 98765 43210</span>
            </div>
            <span className="w-px h-4 bg-gray-600"></span>
            <div className="flex items-center gap-1 cursor-pointer group">
              <Globe className="w-4 h-4" />
              <span className="group-hover:text-[#f59e0b] font-medium transition-colors">English</span>
              <ChevronDown className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <span className="w-px h-4 bg-gray-600"></span>
            <button type="button" onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer group">
              <User className="w-4 h-4" />
              <span className="group-hover:text-[#f59e0b] font-medium transition-colors">
                {user ? `Hi, ${user.name}` : 'Login / Signup'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar (White) */}
      <header className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center cursor-pointer shrink-0">
            <Image
              src="/main.png"
              alt="Dream Home Logo"
              width={160}
              height={60}
              className="w-auto h-[42px] lg:h-[50px] object-contain"
              priority
            />
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-slate-800 font-semibold text-[15px]">
            <Link
              href="/"
              className="relative text-[#f59e0b] py-2 after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-[#f59e0b]"
            >
              Home
            </Link>

            {/* Dynamic links from /api/navbarapi */}
            {navLoading ? (
              <span className="text-slate-300 font-medium">Loading menu...</span>
            ) : navError ? (
              <span className="text-red-400 text-xs font-medium">{navError}</span>
            ) : (
              navLinks.map((link) => {
                const isDropdown = link.name.trim().toLowerCase() === 'buy' || link.name.trim().toLowerCase() === 'rent';
                return (
                  <Link
                    key={link.id}
                    href={`/${link.slug.trim()}`}
                    className="hover:text-[#f59e0b] transition-colors flex items-center gap-1"
                  >
                    {link.name.trim()}
                    {isDropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                );
              })
            )}

            <Link href="/contact" className="hover:text-[#f59e0b] transition-colors">Contact Us</Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            {/* Vertical Divider */}
            <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

            {/* Talk to Our Expert Section */}
            <div className="hidden xl:flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#f59e0b] fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-500 font-medium leading-none mb-1">Talk to Our Expert</span>
                <a href="tel:+919876543210" className="text-[15px] font-bold text-slate-900 leading-none hover:text-[#f59e0b] transition-colors">
                  +91 98765 43210
                </a>
                <span className="text-[11px] text-gray-400 font-medium mt-1 leading-none">Mon - Sat (9AM - 8PM)</span>
              </div>
            </div>

            {/* Profile */}
            <button
              type="button"
              onClick={handleProfileClick}
              className="hidden sm:flex items-center gap-2 border border-slate-200 hover:border-[#f59e0b] rounded-lg px-3 py-2 transition-colors"
              title={user ? user.name : 'Login / Signup'}
            >
              <UserCircle2 className="w-6 h-6 text-slate-500" />
              <span className="hidden md:block text-sm font-semibold text-slate-700 max-w-[90px] truncate">
                {user ? user.name : 'Login'}
              </span>
            </button>

            {/* Add Property Button */}
            <button
              onClick={handleAddProperty}
              className="hidden sm:flex items-center gap-3 bg-[#f59e0b] hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
            >
              <div className="border-[1.5px] border-white rounded-full p-[2px]">
                <Plus className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-bold leading-tight">Add Property</span>
                <span className="text-[11px] font-medium leading-tight opacity-95">List Your Property</span>
              </div>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1">
            {allNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.slug ? `/${item.slug.trim()}` : '/'}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item.name.trim ? item.name.trim() : item.name}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-2"></div>

            <button
              type="button"
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <UserCircle2 className="w-5 h-5 text-slate-500" /> {user ? user.name : 'Login / Signup'}
            </button>

            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); handleAddProperty(); }}
              className="flex items-center justify-center gap-2 mt-2 bg-[#f59e0b] hover:bg-amber-600 text-white px-5 py-3 rounded-lg font-bold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Property
            </button>

            <a href="tel:+919876543210" className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-slate-700">
              <Phone className="w-4 h-4 text-[#f59e0b]" /> +91 98765 43210
            </a>
          </div>
        )}
      </header>
    </div>
  );
}
