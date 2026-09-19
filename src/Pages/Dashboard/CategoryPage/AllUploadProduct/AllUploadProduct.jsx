

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { fetchSuppliers } from "../../../../Api/Api";

const AllUploadProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childcategories, setChildcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
   const [searchTerm, setSearchTerm] = useState(""); 
   const [brands, setBrands] = useState([]);
   const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); 
    //  const image_upload_api = `http://localhost:5000/upload`;
const [campaigns, setCampaigns] = useState([]); // All campaigns from API
  const [selectedCampaign, setSelectedCampaign] = useState(""); // Selected campaign for dropdown
  const [campaignName, setCampaignName] = useState(""); 
  // NEW: pagination state
  const [currentPage, setCurrentPage] = useState(1);
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
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSavingSub, setIsSavingSub] = useState(false);

const sizeDetailsRef = useRef(null);
const colorDetailsRef = useRef(null);

const uploadImage = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("http://localhost:5000/upload", {
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


const handleAddCategory = async () => {
  try {
    let imgUrl = "";
    if (categoryImgFile) imgUrl = await uploadImage(categoryImgFile);

    const res = await fetch("http://localhost:5000/api/categories", {
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
  if (isSavingSub) return;

  if (!form.categoryName) return alert("Select Category first!");
  if (!newSubName.trim()) return alert("Subcategory name is required!");
  // image is optional now

  setIsSavingSub(true);
  try {
    let imgUrl = "";
    if (subImageFile) {
      try {
        imgUrl = await uploadImage(subImageFile);
      } catch (uploadErr) {
        console.error(uploadErr);
        alert("Image upload failed, please try again.");
        return; // stop only if user tried to upload but it failed
      }
    }

    const res = await fetch("http://localhost:5000/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newSubName.trim(),
        categoryName: form.categoryName,
        subcategoryImg: imgUrl, // will just be "" if no image
        status: "Active",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message || "Failed to add subcategory");
    }

    setSubcategories((prev) => [...prev, data]);

    setNewSubName("");
    setSubImageFile(null);
    setOpenSubModal(false);
    alert("Subcategory added successfully!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to add subcategory");
  } finally {
    setIsSavingSub(false);
  }
};

const handleAddChildcategory = async () => {
  if (!form.categoryName) return alert("Select Category first!");
  if (!form.subcategoryName) return alert("Select Subcategory first!");

  try {
    let imgUrl = "";
    if (childImageFile) imgUrl = await uploadImage(childImageFile);

    const res = await fetch("http://localhost:5000/api/childcategories", {
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

    const res = await fetch("http://localhost:5000/api/brands", {
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
     bulletPoints: [],
    subcategoryImg:"",
    childcategoryImg:"",
    stock: "",
    couponPrice: "",
     sellerId: "",        // 🆕 added
  shopName: "",        // 🆕 added
  mobileNumber: "",
    shop: "",
    totalcupon: "",
    description: "",
    availability:"",
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
    axios.get("http://localhost:5000/api/categories").then((r) => setCategories(r.data));
    axios.get("http://localhost:5000/api/subcategories").then((r) => setSubcategories(r.data));
    axios.get("http://localhost:5000/api/childcategories").then((r) => setChildcategories(r.data));
    axios.get("http://localhost:5000/api/brands").then((r) => setBrands(r.data));
     axios.get("http://localhost:5000/api/sellers").then((r) => setSellers(r.data));
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
    const discountPercent =
      ((oldPrice - newPrice) / oldPrice) * 100;

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

  if (isSubmitting) return; // extra safety
  setIsSubmitting(true);

  let uploadedUrls = [];

  try {
    if (files.length) {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axios.post(
          "http://localhost:5000/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!res.data?.success)
          throw new Error(res.data.message || "Upload failed");

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
        `http://localhost:5000/api/products/${editingProduct._id}`,
        productData
      );
      setEditingProduct(null);
    } else {
      await axios.post(
        "http://localhost:5000/api/products",
        productData
      );
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
  } finally {
    setIsSubmitting(false); // 🔑 always stop loading
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
    ? form.size.filter((s) => s !== size)
    : [...form.size, size];
  setForm({ ...form, size: updatedSizes });

  // dropdown বন্ধ করে দেওয়া হচ্ছে
  if (sizeDetailsRef.current) {
    sizeDetailsRef.current.open = false;
  }
};


   const handleSelect = (color) => {
  const alreadySelected = form.color.includes(color);
  const updatedColors = alreadySelected
    ? form.color.filter((c) => c !== color)
    : [...form.color, color];
  setForm({ ...form, color: updatedColors });

  // dropdown বন্ধ করে দেওয়া হচ্ছে
  if (colorDetailsRef.current) {
    colorDetailsRef.current.open = false;
  }
};


  useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/campaigns");
      setCampaigns(res.data); // populate campaigns state
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  fetchCampaigns();
}, []);


  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
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

useEffect(() => {
  const newPrice = Number(form.ProductPrice);
  const couponPrice = Number(form.couponPrice);

  if (newPrice > 0 && couponPrice > 0) {
    const totalCoupon = Math.floor(newPrice / couponPrice);

    setForm((prev) => ({
      ...prev,
      totalcupon: totalCoupon,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      totalcupon: "",
    }));
  }
}, [form.ProductPrice, form.couponPrice]);


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

  {/* ===== Seller Shop Selection ===== */}
<div className="flex flex-col">
  <label className="font-medium mb-1">Seller Shop</label>
  <select
    value={form.sellerId}
    onChange={(e) => {
      const selectedSeller = sellers.find((s) => s.sellerId === e.target.value);
      setForm({
        ...form,
        sellerId: selectedSeller?.sellerId || "",
        shopName: selectedSeller?.shopName || "",
        mobileNumber: selectedSeller?.mobileNumber || "",
      });
    }}
    className="border p-2 rounded w-full md:w-72"
  >
    <option value="">-- Select Seller Shop --</option>
    {sellers.map((seller) => (
      <option key={seller._id} value={seller.sellerId}>
        {seller.shopName} — {seller.sellerId}
      </option>
    ))}
  </select>

  {form.sellerId && (
    <p className="text-xs text-gray-500 mt-1">
      Seller ID: <span className="font-medium">{form.sellerId}</span> | Phone:{" "}
      <span className="font-medium">{form.mobileNumber}</span>
    </p>
  )}
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
      <option value="fordaily">ForDaily</option>
   
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
    <details ref={sizeDetailsRef} className="group">
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
    <details ref={colorDetailsRef} className="group">
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
 

  {/* -------------------- Level 3: Total Coupon -------------------- */}
 

  <div className="flex flex-col">
  <label className="font-medium mb-1">Availability</label>
  <input
    type="text" // changed from "number" to "text"
    placeholder="Availability"
    className="border rounded-lg p-2"
    value={form.availability}
    onChange={(e) => setForm({ ...form, availability: e.target.value })}
  />
</div>

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
  disabled={isSubmitting}
  className={`w-full py-3 rounded-lg text-white flex items-center justify-center gap-2
    ${isSubmitting
      ? "bg-green-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
    }`}
>
  {isSubmitting ? (
    <>
      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
      Uploading...
    </>
  ) : (
    editingProduct ? "Update Product" : "Save Product"
  )}
</button>

      </form>


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
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white p-6 w-96 rounded">
      <h2 className="text-xl mb-1">Add Subcategory</h2>
      <p className="text-xs text-gray-500 mb-3">
        Category: <span className="font-semibold">{form.categoryName}</span>
      </p>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Subcategory Name *"
        value={newSubName}
        onChange={(e) => setNewSubName(e.target.value)}
      />

      <label className="block text-sm font-medium mb-1">Subcategory Image *</label>
      <input
        type="file"
        accept="image/*"
        className="mb-3 block"
        onChange={(e) => setSubImageFile(e.target.files[0] || null)}
      />

      {subImageFile && (
        <img
          src={URL.createObjectURL(subImageFile)}
          alt="preview"
          className="h-20 w-20 object-cover rounded mb-3"
        />
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setOpenSubModal(false);
            setNewSubName("");
            setSubImageFile(null);
          }}
          className="px-3 py-1 border"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAddSubcategory}
          disabled={isSavingSub}
          className="px-3 py-1 bg-green-600 text-white disabled:opacity-60"
        >
          {isSavingSub ? "Saving..." : "Save"}
        </button>
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
          placeholder="Search by Category or Subcategory..."
          className="border rounded-lg p-2 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      
      {/* ----------- Product Table ----------- */}
 

    </div>
  );
};

export default AllUploadProduct;

