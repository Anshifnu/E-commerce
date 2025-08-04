
import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-red-600 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">About Us</h2>
          <p className="text-sm">
            Discover timeless fragrances and luxury perfume collections curated
            with elegance. Our mission is to make every scent an experience.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Customer Service</h2>
          <ul className="text-sm space-y-2">
            <li>Contact Us</li>
            <li>Shipping & Delivery</li>
            <li>Returns & Exchanges</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Connect With Us</h2>
          <ul className="text-sm space-y-2">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Email: support@sentify.com</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-sm border-t border-red-600 pt-4">
        &copy; {new Date().getFullYear()} PerfumeLux. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
