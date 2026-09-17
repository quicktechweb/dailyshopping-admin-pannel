

import { useState, useEffect } from "react";
import axios from "axios";
import { fetchSuppliers } from "../../../../../../Api/Api";

const SellerPendingProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childcategories, setChildcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
   const [searchTerm, setSearchTerm] = useState(""); 
   const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); 
    const [addingProduct, setAddingProduct] = useState(false);

    //  const image_upload_api = `https://dailyshopping-backend.onrender.com/upload`;
const [campaigns, setCampaigns] = useState([]); // All campaigns from API
  const [selectedCampaign, setSelectedCampaign] = useState(""); // Selected campaign for dropdown
  const [campaignName, setCampaignName] = useState(""); 
  // NEW: pagination state
  const productsPerPage = 200;

  // ---- MODAL CONTROL ----
const [openCategoryModal, setOpenCategoryModal] = useState(false);
const [openSubModal, setOpenSubModal] = useState(false);
const [openChildModal, setOpenChildModal] = useState(false);

// ---- Category Add Form ----
const [newCategoryName, setNewCategoryName] = useState("");
const [categoryImgFile, setCategoryImgFile] = useState(null);

// ---- Subcategory Add Form ----
const [newSubName, setNewSubName] = useState("");
const [subImageFile, setSubImageFile] = useState(null);

// ---- ChildCategory Add Form ----
const [newChildName, setNewChildName] = useState("");
const [childImageFile, setChildImageFile] = useState(null);

// BRAND ADD MODAL STATE
const [openBrandModal, setOpenBrandModal] = useState(false);
const [newBrandName, setNewBrandName] = useState(""); // <-- missing
const [brandImgFile, setBrandImgFile] = useState(null);

const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);
const [bulletInput, setBulletInput] = useState("");


const uploadImage = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("https://dailyshopping-backend.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // ❌ backend success না হলে error
    if (!data?.success) {
      throw new Error(data?.message || "Image upload failed");
    }

    // ✅ Success হলে URL return
    return data.url;

  } catch (err) {
    console.error("Upload error:", err);

    // ❌ Error message show
    alert(err.message || "Image upload failed");

    // Error outer function catch করতে চাইলে:
    throw err;
  }
};


// Pagination states
const [currentPage, setCurrentPage] = useState(1);
// const [pageSize, setPageSize] = useState(50);

// Filtered products (search term can be used here if needed)
  const filteredProducts = products.filter((p) => {
  const term = searchTerm.toLowerCase();
  return (
    p.title?.toLowerCase().includes(term) ||
    p.categoryName?.toLowerCase().includes(term) ||
    p.subcategoryName?.toLowerCase().includes(term)
  );
});


// Compute total pages
const [totalPages, setTotalPages] = useState(1);
const [pageSize, setPageSize] = useState(16);
// Current page products
const currentProducts = filteredProducts.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// Page size change handler
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1); // Reset to first page
};

useEffect(() => {
  setProducts([]);     // clear old rows
  fetchProducts(1, pageSize);
}, [pageSize]);

// 🆕 Search করলে পুরো product list থেকে খুঁজবে (শুধু current page না)
 // 🆕 Debounced backend search — সবসময় সার্ভার থেকে filtered + paginated রেজাল্ট আনে
useEffect(() => {
  const delay = setTimeout(() => {
    setCurrentPage(1); // সার্চ পরিবর্তন হলে প্রথম পেজে ফিরে যাবে

    if (searchTerm.trim()) {
      setLoading(true);
      axios
        .get(`https://dailyshopping-backend.onrender.com/api/products/admin-search`, {
          params: { q: searchTerm.trim(), page: 1, limit: pageSize },
        })
        .then((res) => {
          setProducts(res.data?.data || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      fetchProducts(1, pageSize);
    }
  }, 400); // 400ms debounce — প্রতি অক্ষরে API call হবে না

  return () => clearTimeout(delay);
}, [searchTerm, pageSize]);

// Go to page
 const goToPage = (page) => {
  if (page < 1) return;

  if (searchTerm.trim()) {
    setLoading(true);
    axios
      .get(`https://dailyshopping-backend.onrender.com/api/products/admin-search`, {
        params: { q: searchTerm.trim(), page, limit: pageSize },
      })
      .then((res) => {
        setProducts(res.data?.data || []);
        setCurrentPage(page);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  } else {
    fetchProducts(page, pageSize);
  }
};



const handleAddCategory = async () => {
  try {
    let imgUrl = "";
    if (categoryImgFile) imgUrl = await uploadImage(categoryImgFile);

    const res = await fetch("https://dailyshopping-backend.onrender.com/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryName: newCategoryName,
        categoryImg: imgUrl,
        status: "Active",
      }),
    });

    const data = await res.json();
    setCategories((prev) => [...prev, data]);

    setNewCategoryName("");
    setCategoryImgFile(null);
    setOpenCategoryModal(false);
  } catch (err) {
    alert("Failed to add category");
  }
};

const handleAddSubcategory = async () => {
  if (!form.categoryName) return alert("Select Category first!");

  try {
    let imgUrl = "";
    if (subImageFile) imgUrl = await uploadImage(subImageFile);

    const res = await fetch("https://dailyshopping-backend.onrender.com/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newSubName,
        categoryName: form.categoryName,
        subcategoryImg: imgUrl,
        status: "Active",
      }),
    });

    const data = await res.json();
    setSubcategories((prev) => [...prev, data]);

    setNewSubName("");
    setSubImageFile(null);
    setOpenSubModal(false);
  } catch (err) {
    alert("Failed to add subcategory");
  }
};

const handleAddChildcategory = async () => {
  if (!form.categoryName) return alert("Select Category first!");
  if (!form.subcategoryName) return alert("Select Subcategory first!");

  try {
    let imgUrl = "";
    if (childImageFile) imgUrl = await uploadImage(childImageFile);

    const res = await fetch("https://dailyshopping-backend.onrender.com/api/childcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newChildName,
        categoryName: form.categoryName,
        subcategoryName: form.subcategoryName,
        childCategoryImg: imgUrl,
        status: "Active",
      }),
    });

    const data = await res.json();
    setChildcategories((prev) => [...prev, data]);

    setNewChildName("");
    setChildImageFile(null);
    setOpenChildModal(false);
  } catch (err) {
    alert("Failed to add childcategory");
  }
};

const handleAddBrand = async () => {
  if (!newBrandName) return alert("Brand name required!");

  try {
    let brandImgUrl = "";
    if (brandImgFile) {
      brandImgUrl = await uploadImage(brandImgFile);
    }

    const res = await fetch("https://dailyshopping-backend.onrender.com/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName: newBrandName,
        brandImg: brandImgUrl,
        status: "Active",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message || "Failed to add brand");
    }

    setBrands((prev) => [...prev, data]);
    setNewBrandName("");
    setBrandImgFile(null);
    setOpenBrandModal(false);
    alert("Brand added successfully!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to add brand");
  }
};



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
    bulletPoints: [],
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
      campaignId: "",        // selected campaign ID
  campaignName: "",      // campaign name
  campaignImg: "",
  userHighestBuyCoupon: "",  // <-- new field
  stockWarning: "",  
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    axios.get("https://dailyshopping-backend.onrender.com/api/categories").then((r) => setCategories(r.data));
    axios.get("https://dailyshopping-backend.onrender.com/api/subcategories").then((r) => setSubcategories(r.data));
    axios.get("https://dailyshopping-backend.onrender.com/api/childcategories").then((r) => setChildcategories(r.data));
    axios.get("https://dailyshopping-backend.onrender.com/api/brands").then((r) => setBrands(r.data));
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
      campaignId: editingProduct.campaignId || "",
      campaignName: editingProduct.campaignName || "",
      campaignImg: editingProduct.campaignImg || "",
    });
    setFiles([]);
    setPreviews([]);
    setSelectedCampaign(editingProduct.campaignId || "");
  } else {
    setForm(emptyForm);
    setFiles([]);
    setPreviews([]);
    setSelectedCampaign("");
  }
}, [editingProduct]);


 useEffect(() => {
  const oldPrice = Number(form.oldPrice);
  const newPrice = Number(form.ProductPrice);

  if (oldPrice > 0 && newPrice > 0 && oldPrice > newPrice) {
    const discountPercent = ((oldPrice - newPrice) / oldPrice) * 100;

    setForm((prev) => ({
      ...prev,
      discount: `${Math.round(discountPercent)}%`,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      discount: "",
    }));
  }
}, [form.oldPrice, form.ProductPrice]);


   const fetchProducts = async (page = 1, limit = pageSize) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `https://dailyshopping-backend.onrender.com/api/products/pending-products?page=${page}&limit=${limit}`
    );

    setProducts(res.data?.data || []);
    setCurrentPage(page);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


 const handleApprove = async (id) => {
  if (!window.confirm("Approve this product?")) return;
  try {
    await axios.put(`https://dailyshopping-backend.onrender.com/api/products/${id}/approve`);
    alert("✅ Product approved!");
    fetchProducts(currentPage, pageSize); // approve হলে list থেকে সরে যাবে
  } catch (err) {
    console.error(err);
    alert("❌ Failed to approve product");
  }
};

const handleDiscountUpdate = async (id, value) => {
  try {
    await axios.put(`https://dailyshopping-backend.onrender.com/api/products/${id}/productwise-discount`, {
      productwiseDiscount: value,
    });
    // local state এ update করো যাতে UI সাথে সাথে বদলায়
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, productwiseDiscount: value } : p
      )
    );
  } catch (err) {
    console.error(err);
    alert("❌ Failed to update discount");
  }
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

  try {
    if (files.length) {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axios.post("https://dailyshopping-backend.onrender.com/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data?.success) throw new Error(res.data.message || "Upload failed");
        return res.data.url;
      });
      uploadedUrls = await Promise.all(uploadPromises);
    }

    const productData = {
      ...form,
      images: [...(form.images || []), ...uploadedUrls],
      campaignId: form.campaignId || selectedCampaign,
      campaignName: form.campaignName,
      campaignImg: form.campaignImg,
      bulletPoints: form.bulletPoints,
    };

    if (editingProduct) {
      await axios.put(
        `https://dailyshopping-backend.onrender.com/api/products/${editingProduct._id}`,
        productData
      );
      setEditingProduct(null);
    } else {
      await axios.post("https://dailyshopping-backend.onrender.com/api/products", productData);
    }

    setForm(emptyForm);
    setFiles([]);
    setPreviews([]);
    setSelectedCampaign("");
    fetchProducts();
    alert("✅ Product saved successfully!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message || "❌ Error saving product");
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


  useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/campaigns");
      setCampaigns(res.data); // populate campaigns state
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  fetchCampaigns();
}, []);


  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`https://dailyshopping-backend.onrender.com/api/products/${id}`);
      fetchProducts();
    }
  };

  const handleEdit = (p) => {
  setEditingProduct(p); // populate form

  // Scroll to the form
  const formElement = document.querySelector("form"); // or give form an id="productForm"
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth", block: "start" });

    // Focus the first input field (Product Title)
    const firstInput = formElement.querySelector('input[name="title"]');
    if (firstInput) firstInput.focus();
  }
};


  

// 2️⃣ সার্চ রেজাল্ট বদলালে প্রথম পেজে রিসেট
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

// 3️⃣ তারপর pagination হিসাব
const indexOfLast = currentPage * productsPerPage;
const indexOfFirst = indexOfLast - productsPerPage;



// ✅ Show loading before data is ready
 

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ----------- Product Form ----------- */}
      {/* (form code unchanged) */}
      {/* ... existing form code here ... */}
{error && <p className="text-red-600">{error}</p>}
 {(editingProduct || addingProduct) && (
        <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-50 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Category / Sub / Child */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
         <div className="relative">
  <label>Category</label>
  <div className="flex gap-2">
    <select
      value={form.categoryName}
      onChange={(e) => {
        const selected = categories.find(c => c.categoryName === e.target.value);
        setForm({
          ...form,
          categoryName: e.target.value,
          subcategoryName: "",
          childcategoryName: "",
          categoryImg: selected?.categoryImg || "",
        });
      }}
      className="border p-2 rounded w-full"
    >
      <option value="">-- Select Category --</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat.categoryName}>
          {cat.categoryName}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={() => setOpenCategoryModal(true)}
      className="bg-green-500 text-white px-3 rounded"
    >
      +
    </button>
  </div>
</div>

{/* subcategory  */}
<div>
  <label>Subcategory</label>
  <div className="flex gap-2">
    <select
      value={form.subcategoryName}
      onChange={(e) => {
        const selected = subcategories.find(
          s => s.name === e.target.value && s.categoryName === form.categoryName
        );
        setForm({
          ...form,
          subcategoryName: e.target.value,
          childcategoryName: "",
          subcategoryImg: selected?.subcategoryImg || "",
        });
      }}
      disabled={!form.categoryName}
      className="border p-2 rounded w-full"
    >
      <option value="">-- Select Subcategory --</option>
      {filteredSubcategories.map((sub) => (
        <option key={sub._id} value={sub.name}>
          {sub.name}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={() => {
        if (!form.categoryName) return alert("Select category first!");
        setOpenSubModal(true);
      }}
      className="bg-green-500 text-white px-3 rounded"
    >
      +
    </button>
  </div>
</div>

{/* childcategory  */}
<div>
  <label>Childcategory</label>
  <div className="flex gap-2">
    <select
      value={form.childcategoryName}
      onChange={(e) => {
        const selected = childcategories.find(
          c => c.name === e.target.value && c.subcategoryName === form.subcategoryName
        );
        setForm({
          ...form,
          childcategoryName: e.target.value,
          childcategoryImg: selected?.childCategoryImg || "",
        });
      }}
      disabled={!form.subcategoryName}
      className="border p-2 rounded w-full"
    >
      <option value="">-- Select Childcategory --</option>
      {filteredChildcategories.map((child) => (
        <option key={child._id} value={child.name}>
          {child.name}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={() => {
        if (!form.subcategoryName) return alert("Select subcategory first!");
        setOpenChildModal(true);
      }}
      className="bg-green-500 text-white px-3 rounded"
    >
      +
    </button>
  </div>
</div>
      </div>



        {/* ===== CAMPAIGN SELECTION DROPDOWN ===== */}
 {/* ===== CAMPAIGN SELECTION DROPDOWN ===== */}
<div>
  <select
    value={form.campaignId}
    onChange={(e) => {
      const selected = campaigns.find(c => c._id === e.target.value);
      setForm({
        ...form,
        campaignId: selected?._id || "",
        campaignName: selected?.campaignName || "",
        campaignImg: selected?.campaignImg || "",
      });
      setSelectedCampaign(e.target.value);
    }}
    className="border rounded-lg p-2"
  >
    <option value="">Select a Campaign</option>
    {campaigns.map((c) => (
      <option key={c._id} value={c._id}>
        {c.campaignName}
      </option>
    ))}
  </select>

  
</div>



        

        {/* Title & Shop */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* -------------------- Level 1: Product Title -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Title</label>
    <input
      type="text"
      name="title"
      placeholder="Product Title"
      className="border rounded-lg p-2"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
    />
  </div>

  {/* -------------------- Level 1: Brand Select + Modal -------------------- */}
  <div className="flex flex-col relative">
    <label className="font-medium mb-1">Brand</label>
    <div className="flex gap-2 items-center">
      <select
        value={form.brandName}
        onChange={(e) => {
          const selectedBrand = brands.find((b) => b.brandName === e.target.value);
          setForm({
            ...form,
            brandName: e.target.value,
            brandImg: selectedBrand?.brandImg || "",
          });
        }}
        className="border p-2 rounded w-full"
      >
        <option value="">-- Select Brand --</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand.brandName}>
            {brand.brandName}
          </option>
        ))}
      </select>

      {/* + Button to open modal */}
      <button
        type="button"
        onClick={() => setOpenBrandModal(true)}
        className="bg-green-500 text-white px-3 rounded h-10"
      >
        +
      </button>
    </div>

    {/* -------------------- Level 2: Brand Modal -------------------- */}
    {openBrandModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <h2 className="text-lg font-bold mb-4">Add Brand</h2>

          {/* Level 2.1: Brand Name */}
          <input
            type="text"
            placeholder="Brand Name"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          {/* Level 2.2: Brand Image */}
          <input
            type="file"
            onChange={(e) => setBrandImgFile(e.target.files[0])}
            className="mb-3"
          />

          {/* Level 2.3: Modal Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenBrandModal(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBrand}
              className="px-4 py-2 rounded bg-green-500 text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>


        {/* Price fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* -------------------- Level 1: Purchase Price -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Purchase Price</label>
    <input
      type="number"
      placeholder="Purchase Price"
      className="border rounded-lg p-2"
      value={form.purchasePrice}
      onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
    />
  </div>

  {/* -------------------- Level 1: New Price -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">New Price</label>
    <input
      type="number"
      placeholder="New Price"
      className="border rounded-lg p-2"
      value={form.ProductPrice}
      onChange={(e) => setForm({ ...form, ProductPrice: e.target.value })}
    />
  </div>

  {/* -------------------- Level 1: Old Price -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Old Price</label>
    <input
      type="number"
      placeholder="Old Price"
      className="border rounded-lg p-2"
      value={form.oldPrice}
      onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
    />
  </div>

  {/* -------------------- Level 2: Discount -------------------- */}
    <div className="flex flex-col">
    <label className="font-medium mb-1">Discount (%)</label>
    <input
      type="text"
      placeholder="Auto calculated"
      className="border rounded-lg p-2 bg-gray-100"
      value={form.discount}
      readOnly
    />
  </div>

  {/* -------------------- Level 2: Supplier -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Supplier</label>
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
</div>


      

        {/* Rating/Sold/Coupon */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* -------------------- Level 1: Stock -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Stock</label>
    <input
      type="number"
      placeholder="Stock"
      className="border rounded-lg p-2"
      value={form.stock}
      onChange={(e) => setForm({ ...form, stock: e.target.value })}
    />
  </div>

  {/* -------------------- Level 1: Type -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Type</label>
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
  </div>

  {/* ===== Bullet Points ===== */}
<div>
  <label className="block font-semibold mb-2">Key Features</label>

  <div className="flex items-center gap-2">
    <input
      type="text"
      readOnly
      value={`${form.bulletPoints.length} / 4 added`}
      className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
    />

    <button
      type="button"
      onClick={() => setIsBulletModalOpen(true)}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
    >
      +
    </button>
  </div>

  {/* Preview */}
  <ul className="mt-3 space-y-1 text-sm text-gray-700">
    {form.bulletPoints.map((point, i) => (
      <li key={i} className="flex items-center gap-2">
        <span className="text-green-600">•</span> {point}
      </li>
    ))}
  </ul>
</div>


  {/* -------------------- Level 1: Variant -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Variant</label>
    <input
      type="text"
      placeholder="Variant (e.g. 128GB, 256GB)"
      className="border rounded-lg p-2"
      value={form.variant}
      onChange={(e) => setForm({ ...form, variant: e.target.value })}
    />
  </div>

  {/* -------------------- Level 2: Sizes -------------------- */}
  <div className="flex flex-col gap-2">
    <label className="font-medium text-gray-700">Select Sizes</label>
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

  {/* -------------------- Level 2: Colors -------------------- */}
  <div className="flex flex-col gap-2">
    <label className="font-medium text-gray-700">Select Colors</label>
    <div className="relative">
      <details className="group">
        <summary className="cursor-pointer border rounded-lg px-3 py-2 flex justify-between items-center bg-white shadow-sm hover:border-blue-400 transition">
          <span className="text-gray-700 text-sm">
            {form.color.length ? form.color.join(", ") : "Choose colors..."}
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

  {/* -------------------- Level 3: Coupon Price -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Coupon Price</label>
    <input
      type="number"
      placeholder="Coupon Price"
      className="border rounded-lg p-2"
      value={form.couponPrice}
      onChange={(e) => setForm({ ...form, couponPrice: e.target.value })}
    />
  </div>

  {/* -------------------- Level 3: Total Coupon -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Total Coupon</label>
    <input
      type="number"
      placeholder="Total Coupon"
      className="border rounded-lg p-2"
      value={form.totalcupon}
      onChange={(e) => setForm({ ...form, totalcupon: e.target.value })}
    />
  </div>
</div>


        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
          {/* User Highest Buy Coupon */}
<div className="flex flex-col">
  <label htmlFor="userHighestBuyCoupon" className="mb-1 font-medium text-gray-700">
    User Highest Buy Coupon
  </label>
  <input
    type="number"
    id="userHighestBuyCoupon"
    name="userHighestBuyCoupon"
    placeholder="Enter highest buy coupon"
    className="border rounded-lg p-2"
    value={form.userHighestBuyCoupon}
    onChange={(e) => setForm({ ...form, userHighestBuyCoupon: e.target.value })}
  />
</div>

{/* Stock Warning */}
<div className="flex flex-col ">
  <label htmlFor="stockWarning" className="mb-1 font-medium text-gray-700">
    Stock Warning
  </label>
  <input
    type="number"
    id="stockWarning"
    name="stockWarning"
    placeholder="Enter stock warning quantity"
    className="border rounded-lg p-2"
    value={form.stockWarning}
    onChange={(e) => setForm({ ...form, stockWarning: e.target.value })}
  />
</div>

        </div>

        {/* Remaining/Solds/Save */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* -------------------- Level 1: Description -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Description</label>
    <textarea
      placeholder="Description"
      className="border rounded-lg p-3 w-full h-28 resize-y"
      value={form.description}
      onChange={(e) =>
        setForm({ ...form, description: e.target.value })
      }
    />
  </div>

  {/* -------------------- Level 1: Meta Description -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">Meta Description</label>
    <textarea
      placeholder="Meta Description"
      className="border rounded-lg p-3 w-full h-28 resize-y"
      value={form.metadescription}
      onChange={(e) =>
        setForm({ ...form, metadescription: e.target.value })
      }
    />
  </div>

  {/* -------------------- Level 1: Reserved / Future -------------------- */}
  <div className="flex flex-col">
    <label className="font-medium mb-1">&nbsp;</label>
    {/* You can place another field here later if needed */}
  </div>
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
)}

{openCategoryModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white p-6 w-96 rounded">
      <h2 className="text-xl mb-3">Add Category</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Category Name"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setCategoryImgFile(e.target.files[0])}
      />

      <div className="flex justify-end gap-2">
        <button onClick={() => setOpenCategoryModal(false)} className="px-3 py-1 border">Cancel</button>
        <button type="button" onClick={handleAddCategory} className="px-3 py-1 bg-green-600 text-white">Save</button>
      </div>
    </div>
  </div>
)}

{openSubModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white p-6 w-96 rounded">
      <h2 className="text-xl mb-3">Add Subcategory</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Subcategory Name"
        value={newSubName}
        onChange={(e) => setNewSubName(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setSubImageFile(e.target.files[0])}
      />

      <div className="flex justify-end gap-2">
        <button onClick={() => setOpenSubModal(false)} className="px-3 py-1 border">Cancel</button>
        <button type="button" onClick={handleAddSubcategory} className="px-3 py-1 bg-green-600 text-white">Save</button>
      </div>
    </div>
  </div>
)}

{openChildModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white p-6 w-96 rounded">
      <h2 className="text-xl mb-3">Add Childcategory</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Childcategory Name"
        value={newChildName}
        onChange={(e) => setNewChildName(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setChildImageFile(e.target.files[0])}
      />

      <div className="flex justify-end gap-2">
        <button onClick={() => setOpenChildModal(false)} className="px-3 py-1 border">Cancel</button>
        <button type="button" onClick={handleAddChildcategory} className="px-3 py-1 bg-green-600 text-white">Save</button>
      </div>
    </div>
  </div>
)}

{isBulletModalOpen && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">

      <h3 className="text-xl font-bold mb-4 text-center">
        Add Bullet Points
      </h3>

      <input
        type="text"
        placeholder="Enter feature..."
        value={bulletInput}
        onChange={(e) => setBulletInput(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <button
        disabled={
          !bulletInput || form.bulletPoints.length >= 4
        }
        onClick={() => {
          if (form.bulletPoints.length >= 4) return;

          setForm({
            ...form,
            bulletPoints: [...form.bulletPoints, bulletInput],
          });

          setBulletInput("");
        }}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        Add Point
      </button>

      {/* Added list */}
      <ul className="mt-4 space-y-2">
        {form.bulletPoints.map((point, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
          >
            <span>{point}</span>
            <button
              onClick={() =>
                setForm({
                  ...form,
                  bulletPoints: form.bulletPoints.filter((_, i) => i !== index),
                })
              }
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setIsBulletModalOpen(false)}
        className="mt-4 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
      >
        Done
      </button>
    </div>
  </div>
)}


       {/* ----------- Search Box ----------- */}
      <div className="flex justify-end mb-4">
       <input
  type="text"
  placeholder="Search by Title, Category or Subcategory..."
  className="border rounded-lg p-2 w-64"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
      </div>
      
      
      {/* ----------- Product Table ----------- */}
   <div className="always-scrollbar bg-white rounded-2xl shadow p-4 max-h-[700px] overflow-auto">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-xl font-bold">All Products</h2>

    <div className="flex items-center gap-2">
      <span className="font-semibold">Show:</span>
      <select
        value={pageSize}
        onChange={handlePageSizeChange}
        className="border px-2 py-1 rounded"
      >
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={200}>200</option>
        <option value={250}>250</option>
      </select>
    </div>
  </div>
  <table className="w-full text-left border-collapse text-sm">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">Image</th>
        <th className="border p-2">Title</th>
        <th className="border p-2">Category</th>
        <th className="border p-2">Subcategory</th>
        <th className="border p-2">Childcategory</th>
        <th className="border p-2">Purchase</th>
        <th className="border p-2">NewPrice</th>
        <th className="border p-2">Old Price</th>
        <th className="border p-2">Discount</th>
        <th className="border p-2">Product Discount</th>
        <th className="border p-2">Stock</th>
        <th className="border p-2">Brand</th>
        <th className="border p-2">Coupon Price</th>
        <th className="border p-2">Total Coupon</th>
        <th className="border p-2">Description</th>
        <th className="border p-2">Meta Description</th>
        <th className="border p-2">Type</th>
        <th className="border p-2">Size</th>
        <th className="border p-2">Color</th>
        <th className="border p-2">Variant</th>
        <th className="border p-2">Actions</th>
      </tr>
    </thead>
  <tbody>
  {loading ? (
    <tr>
      <td colSpan="20" className="py-10">
        <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
          <div className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium">Loading products...</span>
        </div>
      </td>
    </tr>
  ) : filteredProducts.length === 0 ? (
    <tr>
      <td colSpan="19" className="text-center py-6 text-gray-500">
        No products found
      </td>
    </tr>
  ) : (
    filteredProducts.map((p) => (
      <tr key={p._id} className="hover:bg-gray-50">
        <td className="border p-2">
          <div className="flex flex-wrap gap-1 max-h-14 overflow-hidden">
            {(p.images || []).slice(0, 5).map((url) => (
              <img
                key={url}
                src={url}
                alt={p.title}
                className="h-10 w-10 object-cover rounded"
              />
            ))}
          </div>
        </td>
        <td className="border p-2 truncate max-w-[100px]">{p.title}</td>
        <td className="border p-2 truncate max-w-[80px]">{p.categoryName}</td>
        <td className="border p-2 truncate max-w-[80px]">{p.subcategoryName}</td>
        <td className="border p-2 truncate max-w-[80px]">{p.childcategoryName}</td>
        <td className="border p-2">৳{p.purchasePrice}</td>
        <td className="border p-2">৳{p.ProductPrice}</td>
        <td className="border p-2">৳{p.oldPrice}</td>
        <td className="border p-2">{p.discount}</td>
        <td className="border p-2">
  <input
    type="number"
    defaultValue={p.productwiseDiscount || 0}
    onBlur={(e) => handleDiscountUpdate(p._id, Number(e.target.value))}
    className="border rounded px-2 py-1 w-16 text-sm"
  />
</td>
        <td className="border p-2">{p.stock}</td>
        <td className="border p-2 truncate max-w-[80px]">{p.brandName}</td>
        <td className="border p-2">{p.couponPrice}</td>
        <td className="border p-2">{p.totalcupon}</td>
        <td className="border p-2 truncate max-w-[120px]" title={p.description}>
          {p.description}
        </td>
        <td className="border p-2 truncate max-w-[120px]" title={p.metadescription}>
          {p.metadescription}
        </td>
        <td className="border p-2 truncate max-w-[60px]">{p.type}</td>
        <td className="border p-2 truncate max-w-[50px]">{p.size}</td>
        <td className="border p-2 truncate max-w-[60px]">{p.color}</td>
        <td className="border p-2 truncate max-w-[60px]">{p.variant}</td>
       <td className="border p-2 space-y-1">
  <button
    onClick={() => handleApprove(p._id)}
    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 w-full text-xs"
  >
    Approve
  </button>
  <button
    onClick={() => handleEdit(p)}
    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 w-full text-xs"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(p._id)}
    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 w-full text-xs"
  >
    Delete
  </button>
</td>
      </tr>
    ))
  )}
</tbody>


  </table>

  {/* Pagination */}
 <div className="flex justify-center items-center gap-3 mt-4">
  <button
    onClick={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1 || loading}
    className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span className="font-semibold">
    Page {currentPage}
  </span>

  <button
    onClick={() => goToPage(currentPage + 1)}
    disabled={products.length < pageSize || loading}
    className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

</div>

    </div>
  );
};

export default SellerPendingProduct;

