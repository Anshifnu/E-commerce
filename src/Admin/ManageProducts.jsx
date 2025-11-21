import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../API/axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    brand: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    galleryFiles: [],
    is_active: true,
  });



  const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Scentifyy_images"); // Create in Cloudinary dashboard
  data.append("cloud_name", "dmrp9xwrz"); // Your Cloudinary cloud name

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dmrp9xwrz/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const uploaded = await res.json();
  return uploaded.secure_url; // This is the URL you store in your gallery
};


  const navigate = useNavigate();

  useEffect(() => {
    api.get("admin/manage/products/").then((res) => {
      setProducts(res.data || []);
    });

    api.get("brand/").then((res) => {
      setBrands(res.data || []);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`admin/manage/products/${id}/`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      gallery: product.images?.map((img) => img.image).join(", ") || "",
    });
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
    let galleryUrls = [];
    if (editingProduct.galleryFiles?.length > 0) {
      galleryUrls = await Promise.all(
        editingProduct.galleryFiles.map((file) => uploadToCloudinary(file))
      );
    } else if (editingProduct.gallery) {
      galleryUrls = editingProduct.gallery
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");
    }

    const payload = {
      brand: Number(editingProduct.brand),
      name: editingProduct.name,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
      is_active: Boolean(editingProduct.is_active),
      gallery: galleryUrls,
    };

    const res = await api.patch(
      `admin/manage/products/${editingProduct.id}/`,
      payload
    );

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? res.data : p))
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
    if (!newProduct.brand) {
      alert("Please select a brand");
      return;
    }

    // Upload files to Cloudinary
    let galleryUrls = [];
    if (newProduct.galleryFiles?.length > 0) {
      galleryUrls = await Promise.all(
        newProduct.galleryFiles.map((file) => uploadToCloudinary(file))
      );
    }

    const productToAdd = {
      brand: Number(newProduct.brand),
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      is_active: Boolean(newProduct.is_active),
      gallery: galleryUrls,
    };

    const res = await api.post("admin/manage/products/", productToAdd);
    setProducts((prev) => [...prev, res.data]);
    setIsAddModalOpen(false);
  } catch (error) {
    console.error("Failed to add product:", error.response?.data || error);
  }
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + Add Product
          </button>
        </div>

        {products.length > 0 ? (
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3">
                    <img
                      src={p.images?.[0]?.image}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-3 font-semibold">{p.name}</td>

                  <td className="p-3">${p.price}</td>

                  <td className="p-3">{p.brand}</td>

                  <td className="p-3">{p.stock}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        p.is_active
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products available</p>
        )}
      </div>

      {/* ---------------- EDIT MODAL ---------------- */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            {/* Brand (UPDATED) */}
            <label className="block mb-1 font-medium">Brand</label>
            <select
              name="brand"
              value={editingProduct.brand}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Name */}
            <label className="block mb-1 font-medium">Name</label>
            <input
              name="name"
              value={editingProduct.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Description */}
            <label>Description</label>
            <textarea
              name="description"
              value={editingProduct.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Price */}
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Stock */}
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={editingProduct.stock}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Gallery */}
<label>Gallery Images</label>
<input
  type="file"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setEditingProduct((prev) => ({ ...prev, galleryFiles: files }));
  }}
  className="w-full p-2 border rounded mb-3"
/>



            {/* Active */}
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="is_active"
                checked={editingProduct.is_active}
                onChange={handleInputChange}
              />
              Active
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- ADD PRODUCT MODAL ---------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Add New Product</h2>

            {/* Brand (UPDATED) */}
            <label>Brand</label>
            <select
              name="brand"
              value={newProduct.brand}
              onChange={handleAddInputChange}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Name */}
            <label>Name</label>
            <input
              name="name"
              value={newProduct.name}
              onChange={handleAddInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Description */}
            <label>Description</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleAddInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Price */}
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleAddInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Stock */}
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleAddInputChange}
              className="w-full p-2 border rounded mb-3"
            />

            {/* Gallery */}
           <label>Gallery Images</label>
<label>Gallery Images</label>
<input
  type="file"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({ ...prev, galleryFiles: files }));
  }}
  className="w-full p-2 border rounded mb-3"
/>



            {/* Active */}
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="is_active"
                checked={newProduct.is_active}
                onChange={handleAddInputChange}
              />
              Active
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded"
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
