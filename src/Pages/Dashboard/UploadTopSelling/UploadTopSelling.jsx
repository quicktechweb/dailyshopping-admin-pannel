

import { useState, useEffect } from "react";
import axios from "axios";

const UploadTopSelling = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childcategories, setChildcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // NEW: pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // multiple files + preview URLs
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const emptyForm = {
    title: "",
    categoryName: "",
    subcategoryName: "",
    childcategoryName: "",
    productPrice: "",
    oldPrice: "",
    discount: "",
    rating: "",
    sold: "",
    shop: "",
    totalcupon: "",
    remaining: "",
    solds: "",
    save: "",
    images: [],
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((r) => setCategories(r.data));
    axios.get("http://localhost:5000/api/subcategories").then((r) => setSubcategories(r.data));
    axios.get("http://localhost:5000/api/childcategories").then((r) => setChildcategories(r.data));
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        ...emptyForm,
        ...editingProduct,
        images: editingProduct.images || [],
      });
      setFiles([]);
      setPreviews([]);
    }
  }, [editingProduct]);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/topselling");
    setProducts(res.data);
  };

  const filteredSubcategories = subcategories.filter(
    (s) => s.categoryName === form.categoryName
  );
  const filteredChildcategories = childcategories.filter(
    (c) => c.subcategoryName === form.subcategoryName
  );

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = form.images.length + files.length + newFiles.length;
    if (total > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setForm({ ...form, images: form.images.filter((img) => img !== url) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedUrls = [];
    if (files.length) {
      const uploadPromises = files.map(async (file) => {
        const fd = new FormData();
        fd.append("image", file);
        const r = await axios.post(
          `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
          fd
        );
        return r.data.data.url;
      });
      uploadedUrls = await Promise.all(uploadPromises);
    }

    const productData = {
      ...form,
      images: [...form.images, ...uploadedUrls],
    };

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/topselling/${editingProduct._id}`,
          productData
        );
        setEditingProduct(null);
      } else {
        await axios.post("http://localhost:5000/api/topselling", productData);
      }
      setForm(emptyForm);
      setFiles([]);
      setPreviews([]);
      fetchProducts();
      alert("✅ Product saved successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`http://localhost:5000/api/topselling/${id}`);
      fetchProducts();
    }
  };

  const handleEdit = (p) => setEditingProduct(p);

  // ---------- Pagination calculations ----------
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ----------- Product Form ----------- */}
      {/* (form code unchanged) */}
      {/* ... existing form code here ... */}

        <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-50 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          {editingProduct ? "Edit Product" : "Top Selling Product"}
        </h2>

        {/* Category / Sub / Child */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={form.categoryName}
            onChange={(e) =>
              setForm({
                ...form,
                categoryName: e.target.value,
                subcategoryName: "",
                childcategoryName: "",
              })
            }
            className="border rounded-lg p-2"
          >
            <option value="">-- Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <select
            value={form.subcategoryName}
            onChange={(e) =>
              setForm({
                ...form,
                subcategoryName: e.target.value,
                childcategoryName: "",
              })
            }
            disabled={!form.categoryName}
            className="border rounded-lg p-2"
          >
            <option value="">-- SubCategory --</option>
            {filteredSubcategories.map((sub) => (
              <option key={sub._id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={form.childcategoryName}
            onChange={(e) =>
              setForm({ ...form, childcategoryName: e.target.value })
            }
            disabled={!form.subcategoryName}
            className="border rounded-lg p-2"
          >
            <option value="">-- ChildCategory --</option>
            {filteredChildcategories.map((child) => (
              <option key={child._id} value={child.name}>
                {child.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title & Shop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Title"
            className="border rounded-lg p-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Shop Name"
            className="border rounded-lg p-2"
            value={form.shop}
            onChange={(e) => setForm({ ...form, shop: e.target.value })}
          />
        </div>

        {/* Price fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Product Price"
            className="border rounded-lg p-2"
            value={form.productPrice}
            onChange={(e) =>
              setForm({ ...form, productPrice: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Old Price"
            className="border rounded-lg p-2"
            value={form.oldPrice}
            onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
          />
          <input
            type="text"
            placeholder="Discount"
            className="border rounded-lg p-2"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />
        </div>

        {/* Rating/Sold/Coupon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Rating"
            className="border rounded-lg p-2"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
          <input
            type="number"
            placeholder="Sold"
            className="border rounded-lg p-2"
            value={form.sold}
            onChange={(e) => setForm({ ...form, sold: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total Coupon"
            className="border rounded-lg p-2"
            value={form.totalcupon}
            onChange={(e) =>
              setForm({ ...form, totalcupon: e.target.value })
            }
          />
        </div>

        {/* Remaining/Solds/Save */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Remaining"
            className="border rounded-lg p-2"
            value={form.remaining}
            onChange={(e) =>
              setForm({ ...form, remaining: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Solds"
            className="border rounded-lg p-2"
            value={form.solds}
            onChange={(e) => setForm({ ...form, solds: e.target.value })}
          />
          <input
            type="text"
            placeholder="Save"
            className="border rounded-lg p-2"
            value={form.save}
            onChange={(e) => setForm({ ...form, save: e.target.value })}
          />
        </div>

        {/* Image upload */}
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFilesChange}
            className="border rounded-lg p-2 w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max 5 images total (existing + new)
          </p>

          {/* Existing images with remove option */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {form.images.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New previews */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previews.map((url, idx) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          {editingProduct ? "Update Product" : "Save Product"}
        </button>
      </form>
      
      {/* ----------- Product Table ----------- */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">All Products</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Subcategory</th>
              <th className="border p-2">Childcategory</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Old Price</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Sold</th>
              <th className="border p-2">Shop</th>
              <th className="border p-2">Total Coupon</th>
              <th className="border p-2">Remaining</th>
              <th className="border p-2">Solds</th>
              <th className="border p-2">Save</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border p-2">
                  <div className="flex flex-wrap gap-1">
                    {(p.images || []).map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt={p.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">{p.categoryName}</td>
                <td className="border p-2">{p.subcategoryName}</td>
                <td className="border p-2">{p.childcategoryName}</td>
                <td className="border p-2">৳{p.productPrice}</td>
                <td className="border p-2">৳{p.oldPrice}</td>
                <td className="border p-2">{p.discount}</td>
                <td className="border p-2">{p.rating}</td>
                <td className="border p-2">{p.sold}</td>
                <td className="border p-2">{p.shop}</td>
                <td className="border p-2">{p.totalcupon}</td>
                <td className="border p-2">{p.remaining}</td>
                <td className="border p-2">{p.solds}</td>
                <td className="border p-2">{p.save}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 text-white px-2 py-1 mt-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- Pagination Controls ---------- */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadTopSelling;

