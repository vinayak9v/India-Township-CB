"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/admin/featured-properties');
        const data = await res.json();
        if (data.success) {
          setProperties(data.data.filter((p) => p.status === 'ACTIVE'));
        }
      } catch (err) {
        console.error('Failed to fetch featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (!loading && properties.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 font-sans">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-[#d9982b] font-bold text-sm tracking-widest uppercase mb-2 block">
              Our Properties
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1629] leading-tight">
              Latest Featured Properties
            </h2>
          </div>
          <Link href="/allproject" className="hidden md:flex items-center gap-2 text-slate-600 hover:text-[#d9982b] font-semibold transition-colors">
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Loading properties...</span>
          </div>
        ) : (
          <>
            {/* Property Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} id={property.property_id} />
              ))}
            </div>

            {/* Mobile View All Button */}
            <Link href="/allproject" className="w-full mt-8 md:hidden flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#0a1629] py-3 rounded-xl font-semibold transition-colors text-sm">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}

      </div>
    </section>
  );
}
