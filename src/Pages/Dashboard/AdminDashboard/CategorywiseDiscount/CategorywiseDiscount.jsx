import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryWiseDiscount() {
  const [products, setProducts] = useState([]);
  const [categoryDiscount, setCategoryDiscount] = useState({});

  // Fetch All Products
  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Group products by category
  const categories = products.reduce((acc, product) => {
    if (!acc[product.categoryName]) {
      acc[product.categoryName] = [];
    }
    acc[product.categoryName].push(product);
    return acc;
  }, {});

  // Apply discount for category
  const applyCategoryDiscount = async (categoryName) => {
    const discountValue = categoryDiscount[categoryName];

    if (!discountValue) {
      alert("Enter a discount first!");
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/products/updatediscount/category-discount", {
        categoryName,
        discount: discountValue,
      });

      alert(`Discount updated for ${categoryName}`);
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("Error updating discount");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Category Wise Discount Update</h1>

      {Object.keys(categories).map((cat) => (
        <div
          key={cat}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>{cat}</h2>

          <input
            type="number"
            placeholder="Enter discount %"
            value={categoryDiscount[cat] || ""}
            onChange={(e) =>
              setCategoryDiscount({
                ...categoryDiscount,
                [cat]: e.target.value,
              })
            }
            style={{ padding: "5px", marginRight: "10px" }}
          />

          <button
            onClick={() => applyCategoryDiscount(cat)}
            style={{
              padding: "6px 12px",
              background: "blue",
              color: "white",
              borderRadius: "4px",
            }}
          >
            Apply Discount
          </button>

          <hr />

          {/* <h3>Products:</h3>
          {categories[cat].map((p) => (
            <p key={p._id}>
              <b>{p.title}</b> — Discount: {p.discount || "0"}
            </p>
          ))} */}
        </div>
      ))}
    </div>
  );
}
