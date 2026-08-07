"use client";

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Phone, ShieldCheck, User, ArrowLeft, Loader2, CheckCircle2,
  Home as HomeIcon, Users, Headset, BadgeCheck, ChevronDown
} from 'lucide-react';

const BENEFITS = [
  { icon: CheckCircle2, text: 'List your property for free' },
  { icon: CheckCircle2, text: 'Get genuine buyer & tenant enquiries' },
  { icon: CheckCircle2, text: 'Simple, secure phone number login' },
  { icon: CheckCircle2, text: 'Trusted by thousands across India' },
];

// "Looking to..." maps to the properties.listing_type enum (SELL / RENT).
// PG is offered as a shortcut for RENT + a PG sub-type, since the schema
// doesn't have a separate PG listing type.
const LOOKING_TO_OPTIONS = [
  { key: 'SELL', label: 'Sell' },
  { key: 'RENT', label: 'Rent / Lease' },
  { key: 'PG', label: 'PG' },
];

const PROPERTY_SUB_TYPES = [
  'Flat/Apartment', 'Independent House/Villa', 'Builder Floor', 'Plot/Land',
  'Office Space', 'Shop/Showroom', 'Warehouse', 'Farm House',
];

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState(1); // 1 = enter details, 2 = verify OTP

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Register-only: property intent, carried forward into the Add Property form after signup
  const [lookingTo, setLookingTo] = useState('SELL');
  const [propertyCategory, setPropertyCategory] = useState('RESIDENTIAL');
  const [propertySubType, setPropertySubType] = useState('');
  const [showMoreTypes, setShowMoreTypes] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const switchTab = (tab) => {
    setActiveTab(tab);
    setStep(1);
    setName('');
    setPhone('');
    setOtp('');
    setError('');
    setSuccess('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }
    if (activeTab === 'register' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = activeTab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = activeTab === 'register' ? { name: name.trim(), phone: cleanPhone } : { phone: cleanPhone };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to send OTP.');
      }

      setSuccess(data.message || 'OTP sent to your phone number.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = activeTab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = activeTab === 'register'
        ? { name: name.trim(), phone: phone.trim(), otp: otp.trim() }
        : { phone: phone.trim(), otp: otp.trim() };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Verification failed.');
      }

      if (data.token) localStorage.setItem('authToken', data.token);
      if (data.user) localStorage.setItem('authUser', JSON.stringify(data.user));

      if (activeTab === 'register') {
        setSuccess('Account created! Taking you to finish your listing...');
        const params = new URLSearchParams();
        params.set('listing_type', lookingTo === 'PG' ? 'RENT' : lookingTo);
        params.set('property_type', propertyCategory);
        if (propertySubType) params.set('property_sub_type', propertySubType === 'PG' ? 'PG' : propertySubType);
        else if (lookingTo === 'PG') params.set('property_sub_type', 'PG');
        setTimeout(() => router.push(`/myProperty?${params.toString()}`), 600);
      } else {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push(redirectTo), 600);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fe] font-sans flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1629] to-slate-800 relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#d9982b]/10 rounded-full"></div>
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-[#d9982b]/10 rounded-full"></div>

        <div className="relative z-10 max-w-md">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <HomeIcon className="w-7 h-7 text-[#d9982b]" />
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Buy, Sell or Rent Property <span className="text-[#d9982b]">Faster</span> with IndianTownship
          </h1>
          <p className="text-slate-300 text-sm mb-10">
            Join thousands of buyers, tenants, and owners already using our platform.
          </p>

          <div className="flex flex-col gap-4 mb-10">
            {BENEFITS.map((b, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <b.icon className="w-5 h-5 text-[#d9982b] shrink-0" />
                <span className="text-sm text-slate-200 font-medium">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#d9982b]" />
              <span className="text-xs text-slate-300 font-medium">2500+ Happy Families</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="w-5 h-5 text-[#d9982b]" />
              <span className="text-xs text-slate-300 font-medium">Verified Listings</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-100">

            {step === 1 && (
              <div className="flex border-b border-slate-200 mb-8">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                    activeTab === 'login' ? 'text-[#0a1629]' : 'text-slate-400'
                  }`}
                >
                  Login
                  {activeTab === 'login' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#d9982b]"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                    activeTab === 'register' ? 'text-[#0a1629]' : 'text-slate-400'
                  }`}
                >
                  Register
                  {activeTab === 'register' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#d9982b]"></span>}
                </button>
              </div>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); setError(''); setSuccess(''); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Number
              </button>
            )}

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[#0a1629] mb-1.5">
                {step === 1
                  ? (activeTab === 'login' ? 'Welcome Back' : 'Create Your Account')
                  : 'Verify OTP'}
              </h2>
              <p className="text-sm text-slate-500">
                {step === 1
                  ? (activeTab === 'login'
                      ? "Enter your phone number to login — it's quick and secure"
                      : 'Just your name and phone number to get started')
                  : `Enter the code sent to +91 ${phone}`}
              </p>
            </div>

            {error && (
              <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 font-medium">
                {success}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                {activeTab === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">You&apos;re looking to...</label>
                      <div className="flex flex-wrap gap-2">
                        {LOOKING_TO_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setLookingTo(opt.key)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                              lookingTo === opt.key
                                ? 'bg-amber-50 border-[#d9982b] text-[#0a1629]'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">And it&apos;s a...</label>
                      <div className="flex gap-5 mb-3">
                        {['RESIDENTIAL', 'COMMERCIAL'].map((cat) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="propertyCategory"
                              checked={propertyCategory === cat}
                              onChange={() => setPropertyCategory(cat)}
                              className="w-4 h-4 text-[#d9982b] focus:ring-[#d9982b]"
                            />
                            <span className="text-sm font-medium text-slate-700">{cat === 'RESIDENTIAL' ? 'Residential' : 'Commercial'}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(showMoreTypes ? PROPERTY_SUB_TYPES : PROPERTY_SUB_TYPES.slice(0, 4)).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPropertySubType(type)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                              propertySubType === type
                                ? 'bg-[#0a1629] border-[#0a1629] text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                        {!showMoreTypes && (
                          <button
                            type="button"
                            onClick={() => setShowMoreTypes(true)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#d9982b] flex items-center gap-1 hover:underline"
                          >
                            {PROPERTY_SUB_TYPES.length - 4} more <ChevronDown className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          disabled={loading}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-[#0a1629] font-medium outline-none focus:bg-white focus:border-[#d9982b] focus:ring-2 focus:ring-[#d9982b]/20 transition-all"
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    {activeTab === 'register' ? "Your contact number for buyers to reach you" : 'Phone Number'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-semibold text-slate-500 border-r border-slate-200 pr-3">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      disabled={loading}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-20 pr-11 text-sm text-[#0a1629] font-medium outline-none focus:bg-white focus:border-[#d9982b] focus:ring-2 focus:ring-[#d9982b]/20 transition-all"
                    />
                    <Phone className="absolute right-4 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0a1629] hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</>) : (activeTab === 'register' ? 'Start Now' : 'Send OTP')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Enter OTP</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit code"
                      maxLength={6}
                      disabled={loading}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-[#0a1629] font-semibold tracking-widest text-center text-lg outline-none focus:bg-white focus:border-[#d9982b] focus:ring-2 focus:ring-[#d9982b]/20 transition-all"
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    No SMS gateway is connected yet — check the server console/logs for your OTP.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0a1629] hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>) : (activeTab === 'register' ? 'Verify & Create Account' : 'Verify & Login')}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full text-center text-xs font-semibold text-[#d9982b] hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {step === 1 && (
              <p className="text-center text-xs text-slate-400 mt-7 flex items-center justify-center gap-1.5">
                <Headset className="w-3.5 h-3.5" /> Need help? Call us at +91 98765 43210
              </p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
