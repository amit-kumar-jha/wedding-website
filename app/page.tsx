// app/page.tsx
"use client";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import TimelineD3 from "./components/TimelineD3";
import EventsSection from "./components/EventsSection";
import GallerySection from "./components/GallerySection";
import TravelSection from "./components/TravelSection";
import RSVPSection from "./components/RSVPSection";
import Footer from "./components/Footer";
import OurStory from "./components/OurStory";
import Countdown from "./components/Countdown";
import SeatingChart from "./components/SeatingChart";



export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Navbar />
      <Hero />
      <Countdown />
      <div className="mx-auto max-w-6xl px-4 pb-24 space-y-24">
        <OurStory />
        <EventsSection />
        <TimelineD3 />
        <GallerySection />
        <TravelSection />
      </div>
      <Footer />
    </main>
  );
}

