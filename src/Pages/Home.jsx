import React, { useEffect } from "react";
import Footer from '../Components/Footer.jsx';
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const perfumes = [
  {
    id: 1,
    name: "FRANCIS KURKDJIAN",
    description: "A refreshing blend of jasmine and citrus.",
    image: "https://www.franciskurkdjian.com/on/demandware.static/-/Sites-mfk-master-catalog/default/dw1ee465b1/BR540_REPUSH25-KV_CRYSTAL-ALL_triptych_square_1080x1080.jpg",
    price: "$120"
  },
  {
    id: 2,
    name: "TOM FFRD",
    description: "Deep, warm, and woody - perfect for evenings.",
    image: "https://i.pinimg.com/1200x/93/3f/88/933f885a26b14c9383b71f282fac3aa4.jpg",
    price: "$180"
  },
  {
    id: 3,
    name: "SAHARA",
    description: "Light aquatic notes for a fresh all-day feel.",
    image: "https://i.pinimg.com/1200x/a4/5a/6e/a45a6ec9551f5ddcf7923f415aad35a0.jpg",
    price: "$150"
  }
];

function Home() {
  const user = localStorage.getItem("user")
  const navigate=useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "Admin") {
      navigate("/admin", { replace: true });
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
         
      <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="https://cdn.shopify.com/videos/c/o/v/8cfaba4ba7bf450594383ad5b7645c1a.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-wider">
            Unveil Your <span className="font-serif italic">Signature</span> Scent
          </h1>
          <p className="text-lg text-white/90 mb-8 font-light tracking-wide leading-relaxed">
            Discover timeless elegance with our curated selection of luxury perfumes.
            Crafted to captivate your senses and elevate your essence.
          </p>
          <button onClick={()=>{
              navigate("/product")
            }} className="bg-transparent border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-all duration-300 tracking-wider">
            EXPLORE COLLECTION
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

    
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4 tracking-wider">Featured <span className="font-serif italic">Scents</span></h2>
            <div className="w-20 h-px bg-gray-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {perfumes.map((perfume) => (
              <div key={perfume.id} className="group relative">
                <div className="overflow-hidden aspect-square mb-4">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-light text-gray-800 mb-1 tracking-wider">{perfume.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 font-light">{perfume.description}</p>
                  
                  <button className="mt-4 bg-transparent border border-gray-800 text-gray-800 px-6 py-2 text-sm hover:bg-gray-800 hover:text-white transition-all duration-300 tracking-wider opacity-0 group-hover:opacity-100">
                    Explore More
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button onClick={()=>{
              navigate("/product")
            }} className="bg-gray-800 text-white px-8 py-3 hover:bg-gray-700 transition-all duration-300 tracking-wider">
              VIEW ALL PRODUCTS
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-8 tracking-wider">The Art of <span className="font-serif italic">Perfumery</span></h2>
          <p className="text-gray-600 leading-relaxed mb-8 font-light max-w-3xl mx-auto">
            Each fragrance in our collection is meticulously crafted by master perfumers, blending rare ingredients with modern sophistication. 
            Our perfumes tell a story - one of passion, craftsmanship, and timeless elegance.
          </p>
          <div className="w-20 h-px bg-gray-400 mx-auto mb-8"></div>
          <button className="bg-transparent border border-gray-800 text-gray-800 px-8 py-3 hover:bg-gray-800 hover:text-white transition-all duration-300 tracking-wider">
            OUR STORY
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;