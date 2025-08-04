import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../apiEndpoint";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    price: "",
    stock: true,
    category: "",
    size: "",
    gallery: "",
    video: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${URL}/products`).then((res) => {
      setProducts(res.data || []);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${URL}/products/${editingProduct.id}`,
        editingProduct
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const productToAdd = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        size: newProduct.size,
        gallery: newProduct.gallery.split(",").map((url) => url.trim()),
        stock: Boolean(newProduct.stock),
      };
      await axios.post(`${URL}/products`, productToAdd);
      setProducts((prev) => [...prev, productToAdd]);
      setNewProduct({
        id: "",
        name: "",
        description: "",
        image: "",
        price: "",
        stock: true,
        category: "",
        size: "",
        gallery: "",
        video: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Product Management</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Product
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Products Table */}
        {products.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
              <p className="mt-2 text-gray-500">Add your first product to get started</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Add Product
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <img
              src={editingProduct.image}
              alt="product"
              className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-200"
            />
            
            <div className="space-y-3">
              {[
                { name: "name", placeholder: "Product Name" },
                { name: "price", placeholder: "Price", type: "number" },
                { name: "category", placeholder: "Category" },
              ].map(({ name, placeholder, type = "text" }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{placeholder}</label>
                  <input
                    type={type}
                    name={name}
                    value={editingProduct[name]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="stock"
                  checked={editingProduct.stock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">In Stock</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "id", placeholder: "Product ID" },
                { name: "name", placeholder: "Product Name" },
                { name: "description", placeholder: "Description" },
                { name: "image", placeholder: "Image URL" },
                { name: "price", placeholder: "Price", type: "number" },
                { name: "category", placeholder: "Category" },
                { name: "size", placeholder: "Size (ml)" },
                { name: "gallery", placeholder: "Gallery (comma-separated URLs)" },
                { name: "video", placeholder: "Video URL" },
              ].map(({ name, placeholder, type = "text" }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{placeholder}</label>
                  <input
                    type={type}
                    name={name}
                    value={newProduct[name]}
                    onChange={handleAddInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="stock"
                  checked={newProduct.stock}
                  onChange={handleAddInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">In Stock</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;