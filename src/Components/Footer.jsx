import React from "react";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate=useNavigate()
  const handlechange=()=>{
    navigate("/product")
  }
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-amber-50 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold tracking-wider border-b border-amber-600 pb-2 w-fit">
            PerfumeLux
          </h2>
          <p className="text-sm text-amber-100 leading-relaxed">
            Discover timeless fragrances and luxury perfume collections curated
            with elegance. Our mission is to make every scent an unforgettable
            experience.
          </p>
          <div className="flex space-x-4 pt-2">
            <a 
              href="https://instagram.com/anshif_bin_musthafa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-amber-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a href="#" className="text-amber-200 hover:text-amber-400 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-amber-200 hover:text-amber-400 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>

       
        <div>
          <h3 className="text-lg font-medium mb-4 border-b border-amber-600 pb-2 uppercase tracking-wider">
            Navigation
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Home
              </a>
            </li>
            <li onClick={handlechange}>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Collections
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Best Sellers
              </a>
            </li>
            <li onClick={handlechange}>
              <a href="#" className="hover:text-amber-400 transition-colors">
                New Arrivals
              </a>
            </li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-medium mb-4 border-b border-amber-600 pb-2 uppercase tracking-wider">
            Customer Care
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                FAQs
              </a>
            </li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-medium mb-4 border-b border-amber-600 pb-2 uppercase tracking-wider">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-amber-300" />
              <a 
                href="mailto:support@perfumelux.com" 
                className="hover:text-amber-400 transition-colors"
              >
                support@Scentify.com
              </a>
            </li>
            <li>Mon-Fri: 9AM - 6PM</li>
            <li>Sat-Sun: 10AM - 4PM</li>
            <li>
              <address className="not-italic">
                123 Fragrance Ave, Paris, France
              </address>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12 pt-6 border-t border-amber-800 text-xs tracking-wider">
        <p className="text-amber-300">
          &copy; {new Date().getFullYear()} Scentify. All rights reserved. | 
          <a href="#" className="hover:text-amber-400 px-2">Privacy Policy</a> | 
          <a href="#" className="hover:text-amber-400 px-2">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;