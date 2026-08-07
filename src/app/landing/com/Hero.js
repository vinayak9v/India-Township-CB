"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Play,
  Users,
  Trophy,
  MapPin,
  ChevronDown,
  Search,
  Home,
  Building,
  Tag
} from 'lucide-react';

const PRICE_STEPS = [
  { label: '₹10 L', value: '1000000' },
  { label: '₹25 L', value: '2500000' },
  { label: '₹50 L', value: '5000000' },
  { label: '₹75 L', value: '7500000' },
  { label: '₹1 Cr', value: '10000000' },
  { label: '₹2 Cr', value: '20000000' },
  { label: '₹5 Cr+', value: '50000000' },
];

const MIN_PRICE_OPTIONS = [{ label: 'No Min', value: '' }, ...PRICE_STEPS];
const MAX_PRICE_OPTIONS = [{ label: 'No Max', value: '' }, ...PRICE_STEPS];

const TABS = [
  { key: 'SELL', label: 'Buy', icon: Home },
  { key: 'RENT', label: 'Rent', icon: Building },
  { key: 'POST', label: 'Sell', icon: Tag },
];

// Background image per tab. Drop matching files into /public — falls back to
// home.png automatically if a tab's image hasn't been added yet.
const TAB_BACKGROUNDS = {
  SELL: '/buy.png',
  RENT: '/rent.png',
  POST: '/sell.png',
};

export default function HomePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('SELL');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    // "Sell" is a shortcut to list your own property, not a search filter.
    if (activeTab === 'POST') {
      router.push('/myProperty');
      return;
    }

    const params = new URLSearchParams();
    params.set('listing_type', activeTab);
    if (location.trim()) params.set('q', location.trim());
    if (propertyType) params.set('property_type', propertyType);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);

    router.push(`/allproject?${params.toString()}`);
  };

  return (
    <main className="min-h-screen font-sans bg-slate-50">

      {/* HERO SECTION */}
      <section
        className="relative w-full h-[60vh] min-h-[550px] bg-cover bg-center flex flex-col justify-center transition-[background-image] duration-500"
        style={{ backgroundImage: `url('${TAB_BACKGROUNDS[activeTab]}')` }}
      >
        <div className="absolute inset-0 "></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">

          <div className="flex justify-between items-center w-full">

            <div className="max-w-xl">
              {/* <div className="inline-block bg-white text-slate-800 font-semibold text-xs px-4 py-2 rounded-full mb-6 shadow-sm">
                Find Your Perfect Space
              </div> */}

              {/* <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1629] leading-[1.15] mb-6 tracking-tight">
                Discover A Place <br />
                You&apos;ll <span className="text-[#d9982b]">Love</span> To Live
              </h1> */}

              {/* <p className="text-slate-600 text-base md:text-lg mb-8 max-w-md leading-relaxed font-medium">
                Buy, sell or rent properties easily with the most trusted real estate platform.
              </p> */}

              <div className="flex flex-wrap items-center gap-6">
             

           
              </div>
            </div>

          
          </div>
        </div>

        {/* SEARCH BAR WIDGET */}
        <div className="absolute -bottom-24 left-0 w-full px-6 md:px-12 z-20">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgb(0,0,0,0.1)]">

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#0a1629] text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-[#d9982b]' : ''}`} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            {activeTab === 'POST' ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
                <p className="text-sm text-slate-500">
                  List your property with us and reach thousands of buyers and tenants.
                </p>
                <button
                  onClick={handleSearch}
                  className="bg-[#0a1629] hover:bg-slate-800 transition-colors text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm shadow-lg whitespace-nowrap"
                >
                  <Tag className="w-4 h-4" /> Post Your Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 items-end">

                {/* Location Input */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs font-bold text-slate-800">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Enter location"
                      className="w-full text-sm text-slate-600 border-none outline-none py-2 pr-6 placeholder:text-slate-400"
                    />
                    <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Property Type Select */}
                <div className="flex flex-col gap-2 relative border-l md:border-slate-200 md:pl-6">
                  <label className="text-xs font-bold text-slate-800">Property Type</label>
                  <div className="relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full appearance-none bg-transparent cursor-pointer py-2 pr-6 text-sm text-slate-600 outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Min Price Select */}
                <div className="flex flex-col gap-2 relative border-l md:border-slate-200 md:pl-6">
                  <label className="text-xs font-bold text-slate-800">Min Price</label>
                  <div className="relative">
                    <select
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full appearance-none bg-transparent cursor-pointer py-2 pr-6 text-sm text-slate-600 outline-none"
                    >
                      {MIN_PRICE_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Max Price Select */}
                <div className="flex flex-col gap-2 relative border-l md:border-slate-200 md:pl-6">
                  <label className="text-xs font-bold text-slate-800">Max Price</label>
                  <div className="relative">
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full appearance-none bg-transparent cursor-pointer py-2 pr-6 text-sm text-slate-600 outline-none"
                    >
                      {MAX_PRICE_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-[#0a1629] hover:bg-slate-800 transition-colors text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm w-full shadow-lg"
                >
                  <Search className="w-4 h-4" /> Search Property
                </button>

              </div>
            )}
          </div>
        </div>
      </section>

      <div className="h-32 w-full"></div>

    </main>
  );
}
