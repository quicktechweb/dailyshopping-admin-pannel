import { useEffect, useState } from "react";
import { api } from "../../../api";
// import { api } from "../api";

export default function ProductUpload() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [children, setChildren] = useState([]);

  const [form, setForm] = useState({
    category: "",
    subcategory: "",
    childCategory: "",
    brand: "",
    name: "",
    purchasePrice: "",
    oldPrice: "",
    newPrice: "",
    productType: "",
    unit: "",
    size: "",
    videoUrl: "",
    code: "",
    shortDescription: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [variants, setVariants] = useState([{ color: "", quantity: "", image: null }]);

  // Load categories
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (form.category) {
      api.get(`/categories/subcategories?categoryId=${form.category}`)
         .then(res => setSubcategories(res.data));
    } else setSubcategories([]);
  }, [form.category]);

  // Load child categories when subcategory changes
  useEffect(() => {
    if (form.subcategory) {
      api.get(`/categories/children?subcategoryId=${form.subcategory}`)
         .then(res => setChildren(res.data));
    } else setChildren([]);
  }, [form.subcategory]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (idx, field, value) => {
    const copy = [...variants];
    copy[idx][field] = value;
    setVariants(copy);
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", quantity: "", image: null }]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k,v));
    if (thumbnail) fd.append("thumbnail", thumbnail);

    // variant info
    const variantInfo = variants.map((v,i)=>({
      color:v.color,
      quantity:v.quantity,
      fileIndex:i
    }));
    fd.append("variantInfo", JSON.stringify(variantInfo));
    variants.forEach(v => v.image && fd.append("variants", v.image));

    await api.post("/products", fd, { headers:{ "Content-Type":"multipart/form-data" } });
    alert("✅ Product saved to MongoDB!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl space-y-6">
      <h2 className="text-2xl font-bold">Add Product</h2>

      {/* Category dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select name="subcategory" value={form.subcategory} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Subcategory</option>
          {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select name="childCategory" value={form.childCategory} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Child Category</option>
          {children.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
        </select>
      </div>

      {/* Basic fields */}
      <input name="name" onChange={handleChange} placeholder="Product Name" className="border p-2 w-full rounded" />
      <input name="brand" onChange={handleChange} placeholder="Brand" className="border p-2 w-full rounded" />
      <input name="purchasePrice" onChange={handleChange} placeholder="Purchase Price" className="border p-2 w-full rounded" />
      <input name="oldPrice" onChange={handleChange} placeholder="Old Price" className="border p-2 w-full rounded" />
      <input name="newPrice" onChange={handleChange} placeholder="New Price" className="border p-2 w-full rounded" />
      <textarea name="shortDescription" onChange={handleChange} placeholder="Short Description" className="border p-2 w-full rounded" />
      <textarea name="description" onChange={handleChange} placeholder="Full Description" className="border p-2 w-full rounded" />

      {/* Thumbnail */}
      <div>
        <label className="block font-semibold mb-1">Thumbnail</label>
        <input type="file" onChange={e=>setThumbnail(e.target.files[0])} />
      </div>

      {/* Variants */}
      <div>
        <h3 className="font-semibold mb-2">Variants</h3>
        {variants.map((v,i)=>(
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input placeholder="Color" value={v.color}
              onChange={e=>handleVariantChange(i,"color",e.target.value)}
              className="border p-2 rounded" />
            <input placeholder="Quantity" type="number" value={v.quantity}
              onChange={e=>handleVariantChange(i,"quantity",e.target.value)}
              className="border p-2 rounded" />
            <input type="file"
              onChange={e=>handleVariantChange(i,"image",e.target.files[0])} />
          </div>
        ))}
        <button type="button" onClick={addVariant} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">+ Add Variant</button>
      </div>

      <button type="submit" className="w-full bg-green-600 text-white p-3 rounded font-semibold">
        Save Product
      </button>
    </form>
  );
}
