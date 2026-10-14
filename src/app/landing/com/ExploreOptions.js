"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Warehouse } from 'lucide-react';

// Tiles with `image` show a photo; the rest show an icon on a tinted background.
const OPTIONS = [
  { label: 'Buying a home', href: '/allproject?listing_type=SELL&property_type=RESIDENTIAL', image: '/buy.png' },
  { label: 'Renting a home', href: '/allproject?listing_type=RENT&property_type=RESIDENTIAL', image: '/rent.png' },
  { label: 'Sell / Rent your property', href: '/myProperty', image: '/sell.png', badge: 'FREE', requiresLogin: true },
  { label: 'Explore all projects', href: '/allproject', image: '/home.png' },
  { label: 'Buying commercial spaces', href: '/allproject?listing_type=SELL&property_type=COMMERCIAL', icon: Store, tint: 'from-amber-50 to-orange-100', iconColor: 'text-amber-600' },
  { label: 'Lease commercial spaces', href: '/allproject?listing_type=RENT&property_type=COMMERCIAL', icon: Warehouse, tint: 'from-sky-50 to-blue-100', iconColor: 'text-sky-600' },
];

function TileBody({ option }) {
  const Icon = option.icon;
  return (
    <>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        {option.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={option.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${option.tint} flex items-center justify-center`}>
            <Icon className={`w-12 h-12 ${option.iconColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
          </div>
        )}
        {option.badge && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {option.badge}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-sm font-semibold text-slate-800 group-hover:text-[#d9982b] transition-colors">
        {option.label}
      </p>
    </>
  );
}

export default function ExploreOptions() {
  const router = useRouter();

  const goWithLogin = (href) => {
    const token = localStorage.getItem('authToken');
    router.push(token ? href : `/login?redirect=${href}`);
  };

  return (
    <section className="font-sans bg-slate-50 pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-slate-500 mb-8">
          Get started with exploring real estate options
        </h2>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {OPTIONS.map((option) =>
            option.requiresLogin ? (
              <button
                key={option.label}
                type="button"
                onClick={() => goWithLogin(option.href)}
                className="group text-left w-40 sm:w-auto shrink-0 snap-start"
              >
                <TileBody option={option} />
              </button>
            ) : (
              <Link key={option.label} href={option.href} className="group w-40 sm:w-auto shrink-0 snap-start">
                <TileBody option={option} />
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
