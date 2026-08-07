import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import Hero from './com/Hero'
import TrustBanner from './com/TrustBanner'
import FeaturedProperties from './com/FeaturedProperties'
import PropertyCarousels from './com/PropertyCarousels'
import TopResidentialProjects from './com/TopResidentialProjects'
import Testimonials from './com/Testimonials'
import PartnerLogos from './com/PartnerLogos'

function Homepage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <TrustBanner/>
      <FeaturedProperties/>
      <PropertyCarousels/>  
      <TopResidentialProjects/>
      <Testimonials/>
      <PartnerLogos/>
      <Footer/>
    </div>
  )
}

export default Homepage
