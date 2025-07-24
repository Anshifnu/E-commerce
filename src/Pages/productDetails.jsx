import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // import context

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const { addToCart } = useCart(); // get addToCart from context

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handlePreview = (url, type) => {
    setPreview(url);
    setPreviewType(type);
  };

 


  if (!product) {
    return <p className="p-6 text-center text-gray-500">Loading product...</p>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto bg-white shadow-lg rounded-xl pt-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2 px-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[28rem] object-contain rounded-xl border shadow-md p-4"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-start gap-6 px-4">
          <p className="text-lg text-gray-600 font-semibold">
            Category: <span className="text-gray-800">{product.category}</span>
          </p>

          <p className="text-gray-700 text-md leading-relaxed">{product.description}</p>

          <div className="flex gap-6 text-gray-700 text-md">
            <p><strong>Size:</strong> {product.size}</p>
            <p><strong>Price:</strong> ${product.price}</p>
          </div>

        <button
  className="mt-4 bg-black text-white py-3 px-6 rounded-lg hover:bg-yellow-200 hover:text-black transition-all"
  onClick={() => addToCart(product)} // ✅ use context
>
  Add to Cart
</button>



          {/* Preview Area */}
          {preview && (
            <div className="mt-6 border border-gray-300 p-4 rounded-lg shadow">
              {previewType === 'image' ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-[24rem] object-contain rounded-lg"
                />
              ) : (
                <video controls className="w-full rounded-lg h-[24rem] object-contain">
                  <source src={preview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Thumbnail Gallery and Video */}
          {(product.gallery?.length > 0 || product.video) && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {product.gallery?.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  onClick={() => handlePreview(url, 'image')}
                  className="h-24 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                />
              ))}
              {product.video && (
                <video
                  onClick={() => handlePreview(product.video, 'video')}
                  className="h-24 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                  muted
                >
                  <source src={product.video} type="video/mp4" />
                </video>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
