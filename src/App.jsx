import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Works from './components/Works'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white font-['Inter',sans-serif]">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Works />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
