import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { URL } from '../apiEndpoint';
import api from '../API/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const { addToCart } = useCart();
  const user = localStorage.getItem("user")
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, []);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        // ✅ Prevent inactive products from showing
        if (!res.data.is_active) {
          navigate("/", { replace: true });
          return;
        }

        setProduct(res.data);
        setMainImage(res.data.images);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handlePreview = (url, type) => {
    if (type === 'image') {
      setMainImage(url);
    } else {
      setPreview(url);
      setPreviewType(type);
    }
  };

  const handleAddToCart = () => {
    if (product.stock == 0) {
      alert("Product is out of stock");
      return;
    }
    addToCart(product);
  };

  if (!product) {
    return <p className="p-6 text-center text-gray-500">Loading product...</p>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto bg-white shadow-lg rounded-xl pt-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 px-4">
          <img
            src={mainImage[0].image}
            alt={product.name}
            className="w-full h-[28rem] object-contain rounded-xl border shadow-md p-4"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start gap-6 px-4">
          <p className="text-lg text-gray-600 font-semibold">
            Category: <span className="text-gray-800">{product.brand.name}</span>
          </p>

          <p className="text-gray-700 text-md leading-relaxed">{product.description}</p>

          <div className="flex gap-6 text-gray-700 text-md">
            <p><strong>Size:</strong> {product.size}</p>
            <p><strong>Price:</strong> ${product.price}</p>
          </div>

          <p
            className={`text-sm font-medium ${
              product.stock >= 15 ? "text-green-600" : "text-red-500"
            }`}
          >
            Stock:{" "}
            {product.stock >= 10
              ? product.stock
              : product.stock > 0
              ? `Only ${product.stock} left`
              : "Out of Stock"}
          </p>

          <button
            className="mt-4 bg-black text-white py-3 px-6 rounded-lg hover:bg-yellow-200 hover:text-black transition-all"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {previewType === 'video' && preview && (
            <div className="mt-6 border border-gray-300 p-4 rounded-lg shadow">
              <video controls className="w-full rounded-lg h-[24rem] object-contain">
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

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
