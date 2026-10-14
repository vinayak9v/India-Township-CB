import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import Hero from './com/Hero'
import ExploreOptions from './com/ExploreOptions'
import FeaturedProperties from './com/FeaturedProperties'
import PropertyNeeds from './com/PropertyNeeds'
import PropertyCarousels from './com/PropertyCarousels'
import TopResidentialProjects from './com/TopResidentialProjects'
import PostPropertyBanner from './com/PostPropertyBanner'
import TrustBanner from './com/TrustBanner'
import Testimonials from './com/Testimonials'
import PartnerLogos from './com/PartnerLogos'

function Homepage() {
  return (
    <div className="bg-slate-50">
      <Navbar/>
      <Hero/>
      <ExploreOptions/>
      <FeaturedProperties/>
      <PropertyNeeds/>
      <PropertyCarousels/>
      <TopResidentialProjects/>
      <PostPropertyBanner/>
      <TrustBanner/>
      <Testimonials/>
      <PartnerLogos/>
      <Footer/>
    </div>
  )
}

export default Homepage
