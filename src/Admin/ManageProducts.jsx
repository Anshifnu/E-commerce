import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    axios.get("http://localhost:3000/products").then((res) => {
      setProducts(res.data || []);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
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
        `http://localhost:3000/products/${editingProduct.id}`,
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
      await axios.post("http://localhost:3000/products", productToAdd);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-rose-700">Manage Products</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      {product.stock ? (
                        <span className="text-green-600 font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Not Available
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No products available.</p>
        )}
      </div>

     
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-rose-700">
              Edit Product
            </h2>
            <img
              src={editingProduct.image}
              alt="product"
              className="w-full h-48 object-cover rounded mb-4"
            />
            <input
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="text"
              name="category"
              value={editingProduct.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full border p-2 rounded mb-2"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="stock"
                checked={editingProduct.stock}
                onChange={handleInputChange}
              />
              In Stock
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

     
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-rose-700">
              Add Product
            </h2>
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
              <input
                key={name}
                type={type}
                name={name}
                value={newProduct[name]}
                onChange={handleAddInputChange}
                placeholder={placeholder}
                className="w-full border p-2 rounded mb-2"
              />
            ))}

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="stock"
                checked={newProduct.stock}
                onChange={handleAddInputChange}
              />
              In Stock
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
