

import { useState, useEffect } from "react";
import axios from "axios";
import { fetchSuppliers } from "../../../../Api/Api";

const ShowUploadProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childcategories, setChildcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
   const [searchTerm, setSearchTerm] = useState(""); 
   const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); 
    


  // NEW: pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 200;

  // multiple files + preview URLs
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const emptyForm = {
    title: "",
    categoryName: "",
    subcategoryName: "",
    childcategoryName: "",
    purchasePrice: "",
    ProductPrice: "",
    oldPrice: "",
    discount: "",
    brandName: "",        // new field
    brandImg: "",
    categoryImg:"",
    subcategoryImg:"",
    childcategoryImg:"",
    stock: "",
    couponPrice: "",
    shop: "",
    totalcupon: "",
    description: "",
    metadescription: "",
    save: "",
     supplier: "",
    images: [],
      variant:"",
    type:"",
    color: [],
     size: [],
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((r) => setCategories(r.data));
    axios.get("http://localhost:5000/api/subcategories").then((r) => setSubcategories(r.data));
    axios.get("http://localhost:5000/api/childcategories").then((r) => setChildcategories(r.data));
    axios.get("http://localhost:5000/api/brands").then((r) => setBrands(r.data));
    fetchProducts();
  }, []);

  useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const suppliersData = await fetchSuppliers();
          setSuppliers(suppliersData);
        } catch (err) {
          setError("Failed to load suppliers or products");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
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
    const res = await axios.get("http://localhost:5000/api/products");
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
          `http://localhost:5000/api/products/${editingProduct._id}`,
          productData
        );
        setEditingProduct(null);
      } else {
        await axios.post("http://localhost:5000/api/products", productData);
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


  const colorOptions = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Gray",
    "Brown",
    "Cyan",
  ];

  const sizeOptions = [
    "38mm", "40mm", "41mm", "42mm", "44mm", "45mm", "46mm", "49mm",
    "S", "M", "L", "XL", "XXL",
  ];

  const handleSelectsize = (size) => {
    const alreadySelected = form.size.includes(size);
    const updatedSizes = alreadySelected
      ? form.size.filter((s) => s !== size) // deselect
      : [...form.size, size];               // select
    setForm({ ...form, size: updatedSizes });
  };


    const handleSelect = (color) => {
    const alreadySelected = form.color.includes(color);
    const updatedColors = alreadySelected
      ? form.color.filter((c) => c !== color)
      : [...form.color, color];

    setForm({ ...form, color: updatedColors });
  };


  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  const handleEdit = (p) => setEditingProduct(p);

  // ---------- Pagination calculations ----------
  const filteredProducts = products.filter((p) => {
  const term = searchTerm.toLowerCase();
  return (
    p.title?.toLowerCase().includes(term) ||        // চাইলে title-ও সার্চে নিন
    p.categoryName?.toLowerCase().includes(term) ||
    p.subcategoryName?.toLowerCase().includes(term)
  );
});

// 2️⃣ সার্চ রেজাল্ট বদলালে প্রথম পেজে রিসেট
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

// 3️⃣ তারপর pagination হিসাব
const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
const indexOfLast = currentPage * productsPerPage;
const indexOfFirst = indexOfLast - productsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

// 4️⃣ goToPage একই থাকবে
const goToPage = (page) => {
  if (page < 1 || page > totalPages) return;
  setCurrentPage(page);
};

// ✅ Show loading before data is ready
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ----------- Product Form ----------- */}
      {/* (form code unchanged) */}
      {/* ... existing form code here ... */}
{error && <p className="text-red-600">{error}</p>}
        <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-50 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Category / Sub / Child */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
  value={form.categoryName}
  onChange={(e) => {
    const selectedCategory = categories.find(
      (c) => c.categoryName === e.target.value
    );
    setForm({
      ...form,
      categoryName: e.target.value,
      subcategoryName: "",
      childcategoryName: "",
      categoryImg: selectedCategory ? selectedCategory.categoryImg : "",
      subcategoryImg: "",   // reset
      childcategoryImg: "", // reset
    });
  }}
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
  onChange={(e) => {
    const selectedSub = subcategories.find(
      (s) => s.name === e.target.value && s.categoryName === form.categoryName
    );
    setForm({
      ...form,
      subcategoryName: e.target.value,
      childcategoryName: "",
      subcategoryImg: selectedSub ? selectedSub.subcategoryImg : "",
      childcategoryImg: "", // reset
    });
  }}
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
  onChange={(e) => {
    const selectedChild = childcategories.find(
      (c) => c.name === e.target.value && c.subcategoryName === form.subcategoryName
    );
    setForm({
      ...form,
      childcategoryName: e.target.value,
      childcategoryImg: selectedChild ? selectedChild.childCategoryImg : "",
    });
  }}
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
          {/* <input
            type="text"
            placeholder="Shop Name"
            className="border rounded-lg p-2"
            value={form.shop}
            onChange={(e) => setForm({ ...form, shop: e.target.value })}
          /> */}
          <select
  value={form.brandName}
  onChange={(e) => {
    const selectedBrand = brands.find((b) => b.brandName === e.target.value);
    setForm({
      ...form,
      brandName: e.target.value,
      brandImg: selectedBrand ? selectedBrand.brandImg : "",
    });
  }}
  className="border rounded-lg p-2"
>
  <option value="">-- Select Brand --</option>
  {brands.map((brand) => (
    <option key={brand._id} value={brand.brandName}>
      {brand.brandName}
    </option>
  ))}
</select>

        </div>

        {/* Price fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Purchase Price"
            className="border rounded-lg p-2"
            value={form.purchasePrice}
            onChange={(e) =>
              setForm({ ...form, purchasePrice: e.target.value })
            }
          />
           <input
            type="number"
            placeholder="New Price"
            className="border rounded-lg p-2"
            value={form.ProductPrice}
            onChange={(e) =>
              setForm({ ...form, ProductPrice: e.target.value })
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

           {/* <label className="mb-1 font-medium">Supplier</label> */}
          <select
            className="border p-2 rounded"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          
        </div>

      

        {/* Rating/Sold/Coupon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Stock"
            className="border rounded-lg p-2"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <select
    value={form.type}
    onChange={(e) => setForm({ ...form, type: e.target.value })}
    className="border rounded-lg p-2"
  >
    <option value="">-- Type --</option>
    <option value="topselling">TopSelling</option>
    <option value="premium">Premium</option>
    <option value="deals">Deals</option>
  </select>

 <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Select Sizes</label>

      {/* Dropdown */}
      <div className="relative">
        <details className="group">
          <summary className="cursor-pointer border rounded-lg px-3 py-2 flex justify-between items-center bg-white shadow-sm hover:border-blue-400 transition">
            <span className="text-gray-700 text-sm">
              {form.size.length ? form.size.join(", ") : "Choose sizes..."}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-52 overflow-y-auto">
            {sizeOptions.map((size) => {
              const isSelected = form.size.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSelectsize(size)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm ${
                    isSelected ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  } hover:bg-blue-50 transition`}
                >
                  <span>{size}</span>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </details>
      </div>
    </div>

   <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Select Colors
      </label>

      {/* Dropdown */}
      <div className="relative">
        <details className="group">
          <summary className="cursor-pointer border rounded-lg px-3 py-2 flex justify-between items-center bg-white shadow-sm hover:border-blue-400 transition">
            <span className="text-gray-700 text-sm">
              {form.color.length
                ? form.color.join(", ")
                : "Choose colors..."}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-52 overflow-y-auto">
            {colorOptions.map((color) => {
              const isSelected = form.color.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelect(color)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm ${
                    isSelected ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  } hover:bg-blue-50 transition`}
                >
                  <span>{color}</span>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </details>
      </div>
    </div>

  <input
    type="text"
    placeholder="Variant (e.g. 128GB, 256GB)"
    className="border rounded-lg p-2"
    value={form.variant}
    onChange={(e) => setForm({ ...form, variant: e.target.value })}
  />
          <input
            type="number"
            placeholder="CouponPrice"
            className="border rounded-lg p-2"
            value={form.couponPrice}
            onChange={(e) => setForm({ ...form, couponPrice: e.target.value })}
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
         {/* Description */}
<textarea
  placeholder="Description"
  className="border rounded-lg p-3 w-full h-28 resize-y"
  value={form.description}
  onChange={(e) =>
    setForm({ ...form, description: e.target.value })
  }
/>

{/* Meta Description */}
<textarea
  placeholder="Meta Description"
  className="border rounded-lg p-3 w-full h-28 resize-y "
  value={form.metadescription}
  onChange={(e) =>
    setForm({ ...form, metadescription: e.target.value })
  }
/>

          {/* <input
            type="text"
            placeholder="Save"
            className="border rounded-lg p-2"
            value={form.save}
            onChange={(e) => setForm({ ...form, save: e.target.value })}
          /> */}
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


       {/* ----------- Search Box ----------- */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Category or Subcategory..."
          className="border rounded-lg p-2 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      
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
              <th className="border p-2">stock</th>
              <th className="border p-2">brand</th>
              <th className="border p-2">CouponPrice</th>
              <th className="border p-2">Total Coupon</th>
              {/* <th className="border p-2">Description</th> */}
              {/* <th className="border p-2">metadescription</th> */}
              <th className="border p-2">Type</th>
    <th className="border p-2">Size</th>
    <th className="border p-2">Color</th>
    <th className="border p-2">Variant</th>
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
                <td className="border p-2">৳{p.purchasePrice}</td>
                <td className="border p-2">৳{p.ProductPrice}</td>
                <td className="border p-2">৳{p.oldPrice}</td>
                <td className="border p-2">{p.discount}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">{p.brandName}</td>
                <td className="border p-2">{p.couponPrice}</td>
                <td className="border p-2">{p.totalcupon}</td>
                {/* <td className="border p-2">{p.description}</td> */}
                {/* <td className="border p-2">{p.metadescription}</td> */}
               <td className="border p-2">{p.type}</td>
      <td className="border p-2">{p.size}</td>
      <td className="border p-2">{p.color}</td>
      <td className="border p-2">{p.variant}</td>
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

export default ShowUploadProduct;

