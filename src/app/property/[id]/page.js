"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin, BedDouble, Bath, Maximize, Compass, Car, Building2,
  ChevronRight, Loader2, FileText, Image as ImageIcon, Phone, CheckCircle2,
  Layers, Grid2x2, X, ChevronLeft, ShieldCheck
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const { id } = params;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const res = await fetch(`/api/properties/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          setProperty(data.data);
          setActiveImage(0);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <span className="text-sm">Loading property...</span>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !property) {
    return (
      <main className="min-h-screen bg-[#f8fafc] font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <Building2 className="w-12 h-12 text-slate-300 mb-4" />
          <h1 className="text-xl font-bold text-[#0a1629] mb-2">Property Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">This listing may have been removed or is not yet approved.</p>
          <Link href="/allproject" className="bg-[#0a1629] hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
            Browse All Projects
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = property.images || [];
  const mainImage = images[activeImage]?.image || null;
  const extraCount = images.length - 5;

  const openGalleryAt = (idx) => {
    setActiveImage(idx);
    setGalleryOpen(true);
  };

  const specs = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ?? "N/A" },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms ?? "N/A" },
    { icon: Maximize, label: "Area", value: property.area_sqft ? `${property.area_sqft} Sqft` : "N/A" },
    { icon: Compass, label: "Facing", value: property.facing || "N/A" },
    { icon: Car, label: "Parking", value: property.parking ?? "N/A" },
    { icon: Building2, label: "Furnishing", value: property.furnishing ? property.furnishing.replaceAll("_", " ") : "N/A" },
  ];

  const quickFacts = [
    property.property_sub_type,
    property.bedrooms ? `${property.bedrooms} Bed` : null,
    property.bathrooms ? `${property.bathrooms} Bath` : null,
    property.area_sqft ? `${property.area_sqft} Sqft` : null,
    property.furnishing ? property.furnishing.replaceAll("_", " ") : null,
  ].filter(Boolean);

  const priceLabel = property.price ? `₹${Number(property.price).toLocaleString("en-IN")}` : "Price on Request";

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans pb-24 lg:pb-16">
      <Navbar />

      <div className="max-w-[85rem] mx-auto px-4 md:px-8 pt-5">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#d9982b]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/allproject" className="hover:text-[#d9982b]">All Projects</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0a1629] font-semibold truncate max-w-[200px]">{property.title}</span>
        </div>

        {/* ================= GALLERY (mosaic) ================= */}
        <div className="mb-6 rounded-2xl overflow-hidden">
          {images.length === 0 ? (
            <div className="w-full h-[280px] md:h-[420px] bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[280px] md:h-[420px]">
              <button
                onClick={() => openGalleryAt(0)}
                className="col-span-4 row-span-2 md:col-span-2 md:row-span-2 relative overflow-hidden bg-slate-100 group"
              >
                <img src={images[0].image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </button>

              {images.slice(1, 5).map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => openGalleryAt(i + 1)}
                  className="hidden md:block relative overflow-hidden bg-slate-100 group"
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {i === 3 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                      +{extraCount} Photos
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <button
              onClick={() => openGalleryAt(activeImage)}
              className="mt-2 flex items-center gap-2 text-xs font-bold text-[#0a1629] bg-white border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm hover:border-[#d9982b] transition-colors md:hidden"
            >
              <Grid2x2 className="w-3.5 h-3.5" /> View all {images.length} photos
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ================= LEFT: DETAILS ================= */}
          <div className="flex-1 min-w-0">

            {/* Title block */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 mb-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${property.listing_type === "RENT" ? "bg-[#d9982b]" : "bg-emerald-600"}`}>
                  {property.listing_type === "RENT" ? "For Rent" : "For Sale"}
                </span>
                {property.status === "ACTIVE" && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified Listing
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-[28px] font-bold text-[#0a1629] mb-2 leading-snug">{property.title}</h1>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <MapPin className="w-4 h-4 text-[#d9982b] shrink-0" />
                <span>{[property.location, property.city].filter(Boolean).join(", ") || "Location not specified"}</span>
              </div>

              {quickFacts.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 border-t border-slate-100">
                  {quickFacts.map((fact, i) => (
                    <span key={i} className="flex items-center text-sm font-semibold text-slate-700 capitalize">
                      {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-300 mr-3"></span>}
                      {fact}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 mb-5">
              <h2 className="text-base font-bold text-[#0a1629] mb-5 flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-[#d9982b]" /> Property Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <spec.icon className="w-5 h-5 text-[#d9982b]" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-medium">{spec.label}</div>
                      <div className="text-sm font-semibold text-[#0a1629] capitalize">{spec.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {property.listing_type === "RENT" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
                  {property.security_deposit && (
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-medium">Security Deposit</div>
                      <div className="text-sm font-semibold text-[#0a1629]">₹{Number(property.security_deposit).toLocaleString("en-IN")}</div>
                    </div>
                  )}
                  {property.maintenance_charge && (
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-medium">Maintenance</div>
                      <div className="text-sm font-semibold text-[#0a1629]">₹{Number(property.maintenance_charge).toLocaleString("en-IN")}</div>
                    </div>
                  )}
                  {property.available_from && (
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-medium">Available From</div>
                      <div className="text-sm font-semibold text-[#0a1629]">
                        {new Date(property.available_from).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 mb-5">
                <h2 className="text-base font-bold text-[#0a1629] mb-4">About this property</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 mb-5">
                <h2 className="text-base font-bold text-[#0a1629] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map((a) => (
                    <div key={a.id} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#d9982b]" />
                      </span>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            {property.floor_plans?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 mb-5">
                <h2 className="text-base font-bold text-[#0a1629] mb-4">Floor Plans</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.floor_plans.map((fp) => (
                    <div key={fp.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <img src={fp.image} alt={fp.title || "Floor plan"} className="w-full h-48 object-cover" />
                      {fp.title && <div className="p-3 text-sm font-medium text-slate-700">{fp.title}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Master Plans */}
            {property.master_plans?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 mb-5">
                <h2 className="text-base font-bold text-[#0a1629] mb-4">Master Plan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.master_plans.map((mp) => (
                    <img key={mp.id} src={mp.image} alt="Master plan" className="w-full h-48 object-cover rounded-xl border border-slate-200" />
                  ))}
                </div>
              </div>
            )}

            {/* Brochures */}
            {property.brochures?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7">
                <h2 className="text-base font-bold text-[#0a1629] mb-4">Brochures</h2>
                <div className="flex flex-col gap-2">
                  {property.brochures.map((b) => (
                    <a
                      key={b.id}
                      href={b.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-4 py-3 hover:border-[#d9982b] hover:text-[#d9982b] transition-colors"
                    >
                      <FileText className="w-4 h-4 shrink-0" /> {b.title || "Download Brochure"}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT: STICKY PRICE/CONTACT CARD ================= */}
          <div className="hidden lg:block w-[340px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                {property.listing_type === "RENT" ? "Monthly Rent" : "Price"}
              </div>
              <div className="text-3xl font-extrabold text-[#0a1629] mb-5">{priceLabel}</div>

              <div className="h-px bg-slate-100 mb-5"></div>

              <h3 className="text-sm font-bold text-[#0a1629] mb-1">Interested in this property?</h3>
              <p className="text-xs text-slate-500 mb-5">Get in touch with our team for a site visit or more details.</p>

              <a
                href="tel:+919876543210"
                className="w-full flex items-center justify-center gap-2 bg-[#0a1629] hover:bg-slate-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors mb-3"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-[#d9982b] hover:text-[#d9982b] text-slate-700 font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Enquire Now
              </Link>

              <p className="text-center text-xs text-slate-400 mt-4">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE STICKY BOTTOM BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgb(0,0,0,0.06)] z-40">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
            {property.listing_type === "RENT" ? "Rent/mo" : "Price"}
          </div>
          <div className="text-lg font-extrabold text-[#0a1629]">{priceLabel}</div>
        </div>
        <a
          href="tel:+919876543210"
          className="flex items-center gap-2 bg-[#0a1629] hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shrink-0"
        >
          <Phone className="w-4 h-4" /> Call Now
        </a>
      </div>

      {/* ================= FULLSCREEN GALLERY ================= */}
      {galleryOpen && images.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-sm font-medium">{activeImage + 1} / {images.length}</span>
            <button onClick={() => setGalleryOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-4">
            <button
              onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 md:left-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <img src={images[activeImage].image} alt="" className="max-h-[75vh] max-w-full object-contain rounded-lg" />
            <button
              onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
              className="absolute right-2 md:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-4">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  idx === activeImage ? "border-[#d9982b]" : "border-transparent opacity-60"
                }`}
              >
                <img src={img.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
