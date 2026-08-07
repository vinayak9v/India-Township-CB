"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Loader2, Phone, Mail, Calendar, ShieldCheck, Building2,
  Image as ImageIcon, MapPin, Eye, Plus, User as UserIcon
} from "lucide-react";

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  INACTIVE: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function ProfilePage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [token, setToken] = useState(null);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      router.replace("/login?redirect=/profile");
      return;
    }
    setToken(storedToken);
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked || !token) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setProfile(data.data);
        else if (res.status === 401) router.replace("/login?redirect=/profile");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchProperties = async () => {
      setPropertiesLoading(true);
      try {
        const res = await fetch("/api/seller/properties", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setProperties(data.data);
      } catch (err) {
        console.error("Failed to fetch my properties:", err);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProfile();
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, token]);

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#f8fafc] font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <span className="text-sm">Checking your session...</span>
        </div>
        <Footer />
      </main>
    );
  }

  const statusCounts = properties.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6">
          {profileLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : profile ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-2xl font-bold text-[#d9982b] border border-amber-100">
                {profile.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-7 h-7" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-[#0a1629]">{profile.name}</h1>
                  {profile.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#d9982b]" /> {profile.phone}</span>
                  {profile.email && (
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#d9982b]" /> {profile.email}</span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#d9982b]" />
                    Member since {new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Unable to load profile.</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 border border-slate-200 rounded-xl text-center">
            <p className="text-2xl font-bold text-[#0a1629]">{propertiesLoading ? "—" : properties.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Listings</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl text-center">
            <p className="text-2xl font-bold text-emerald-600">{propertiesLoading ? "—" : statusCounts.ACTIVE || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Active</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl text-center">
            <p className="text-2xl font-bold text-amber-600">{propertiesLoading ? "—" : statusCounts.PENDING || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Pending Review</p>
          </div>
          <div className="bg-white p-4 border border-slate-200 rounded-xl text-center">
            <p className="text-2xl font-bold text-slate-500">{propertiesLoading ? "—" : properties.reduce((sum, p) => sum + (p.views || 0), 0)}</p>
            <p className="text-xs text-slate-500 mt-1">Total Views</p>
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0a1629]">My Listings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Properties you&apos;ve submitted and their current status.</p>
            </div>
            <Link
              href="/myProperty"
              className="flex items-center gap-1.5 bg-[#0a1629] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Add Property
            </Link>
          </div>

          <div className="p-6">
            {propertiesLoading ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Building2 className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 mb-4">You haven&apos;t listed any properties yet.</p>
                <Link href="/myProperty" className="bg-[#0a1629] hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((prop) => {
                  const card = (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow h-full">
                      <div className="relative h-32 w-full bg-slate-100">
                        {prop.image ? (
                          <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-7 h-7" />
                          </div>
                        )}
                        <span className={`absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${STATUS_STYLES[prop.status] || STATUS_STYLES.PENDING}`}>
                          {prop.status || "PENDING"}
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-[#0a1629] truncate mb-1">{prop.title}</h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{[prop.location, prop.city].filter(Boolean).join(", ") || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-sm font-bold text-[#0a1629]">
                            {prop.price ? `₹${Number(prop.price).toLocaleString("en-IN")}` : "N/A"}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <Eye className="w-3 h-3" /> {prop.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  return prop.status === "ACTIVE" ? (
                    <Link href={`/property/${prop.id}`} key={prop.id}>{card}</Link>
                  ) : (
                    <div key={prop.id}>{card}</div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
