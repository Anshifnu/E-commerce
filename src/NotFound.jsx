import React from 'react';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center   justify-center bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="text-center p-12 bg-white bg-opacity-90 rounded-xl border border-rose-100 shadow-lg backdrop-blur-sm">
        {/* Perfume bottle decorative element */}
        <div className="mx-auto w-16 h-32 mb-8 relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-24 bg-gradient-to-t from-amber-300 to-rose-300 rounded-lg"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-rose-200 rounded-t-full"></div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full"></div>
        </div>

        <h1 className="text-6xl font-bold text-rose-800 font-serif tracking-tight">
          404
        </h1>
        
        <p className="text-xl text-rose-600 mt-4 font-medium tracking-wider">
          Fragrance Not Found
        </p>
        
        <p className="mt-3 text-rose-500 max-w-md mx-auto">
          This scent has evaporated into the ether. Perhaps our collection can entice you?
        </p>
        
        <button 
          onClick={() => window.history.back()}
          className="mt-8 px-6 py-2.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center mx-auto gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to Our Collection
        </button>
        
        <div className="mt-10 pt-6 border-t border-rose-100">
          <p className="text-xs text-rose-400 tracking-wide">ESSENCE • ELEGANCE • EXCLUSIVITY</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;