"use client";
import Link from 'next/link';
import { 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronUp 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#081525] text-slate-300 font-sans relative pt-16 pb-6">
      
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <Home className="text-amber-500 w-8 h-8" strokeWidth={1.5} />
              <div className="flex flex-col leading-tight">
                <div className="text-lg font-extrabold tracking-wide">
                  <span className="text-white">DREAM</span>{' '}
                  <span className="text-amber-500">HOME</span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-[0.15em] uppercase font-medium">
                  Properties
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-xs">
              Your trusted partner in real estate.<br />
              We help you buy, sell and rent<br />
              properties with ease.
            </p>

            {/* Social Icons (Using Inline SVGs to replace removed Lucide brand icons) */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link href="/buy" className="hover:text-amber-500 transition-colors">Buy</Link></li>
              <li><Link href="/rent" className="hover:text-amber-500 transition-colors">Rent</Link></li>
              <li><Link href="/sell" className="hover:text-amber-500 transition-colors">Sell</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Properties */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6">Properties</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Apartments</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Villas</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Independent House</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Plots</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Commercial</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Our Services</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span>123, 4th Main Road,<br />HSR Layout, Bangalore - 560102</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                <span>info@dreamhome.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section (Copyright & Legal) */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative">
          <p>© 2024 Dream Home Properties. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-amber-500 transition-colors">Terms & Conditions</Link>
            <span className="w-[1px] h-3 bg-slate-700"></span>
            <Link href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
          </div>

          {/* Scroll to Top Button */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute -top-14 right-0 md:-right-4 w-10 h-10 bg-[#d9982b] hover:bg-amber-500 transition-colors rounded-md flex items-center justify-center shadow-lg"
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}