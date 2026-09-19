import { useEffect, useState } from "react";
import axios from "axios";

const CATEGORIES_PER_PAGE = 5; // চাইলে সংখ্যা বদলান

// ---------------- Skeleton Components ----------------
const SkeletonLine = ({ width = "100%", height = "36px" }) => (
  <div
    className="bg-gray-200 rounded animate-pulse"
    style={{ width, height }}
  />
);

const CategoryCardSkeleton = () => (
  <div className="bg-white p-5 mb-4 rounded shadow border">
    <div className="h-5 bg-gray-200 rounded animate-pulse w-40 mb-4" />
    <div className="flex gap-3 flex-wrap mb-3">
      <SkeletonLine width="150px" />
      <SkeletonLine width="110px" />
      <SkeletonLine width="90px" />
      <SkeletonLine width="150px" />
      <SkeletonLine width="150px" />
      <SkeletonLine width="90px" />
    </div>
    <div className="h-4 bg-gray-100 rounded animate-pulse w-32 mb-2" />
    <div className="h-10 bg-gray-100 rounded animate-pulse w-full" />
  </div>
);

const PromoTableSkeleton = () => (
  <div className="mt-3 border-t pt-3">
    <div className="h-3 bg-gray-100 rounded animate-pulse w-28 mb-2" />
    <div className="h-8 bg-gray-100 rounded animate-pulse w-full" />
  </div>
);

export default function PromoManager() {
  const [products, setProducts] = useState([]);
  const [promoData, setPromoData] = useState({});
  const [categoryPromos, setCategoryPromos] = useState({}); // fetched promo per category
  const [allPromo, setAllPromo] = useState({
    promoCode: "",
    promoType: "",
    promoValue: "",
    startDate: "",
    endDate: "",
  });

  // 🔄 Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [updatingCat, setUpdatingCat] = useState(null); // category currently being updated
  const [deletingCat, setDeletingCat] = useState(null); // category currently being deleted

  // 🔍 Search + Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Load products
  useEffect(() => {
    setLoadingProducts(true);
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Failed to load products"))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Load already-applied category promos
  const fetchCategoryPromos = async () => {
    setLoadingPromos(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/promo/category-list"
      );
      const map = {};
      (res.data.data || []).forEach((p) => {
        map[p._id] = p; // _id = categoryName (from aggregate group)
      });
      setCategoryPromos(map);
    } catch (err) {
      console.error("Failed to fetch category promos", err);
    } finally {
      setLoadingPromos(false);
    }
  };

  useEffect(() => {
    fetchCategoryPromos();
  }, []);

  // Group products by category
  const categories = products.reduce((acc, p) => {
    if (!p.categoryName) return acc;
    if (!acc[p.categoryName]) acc[p.categoryName] = [];
    acc[p.categoryName].push(p);
    return acc;
  }, {});

  // Search filter (category name diye)
  const filteredCategoryNames = Object.keys(categories).filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredCategoryNames.length / CATEGORIES_PER_PAGE);
  const paginatedCategoryNames = filteredCategoryNames.slice(
    (currentPage - 1) * CATEGORIES_PER_PAGE,
    currentPage * CATEGORIES_PER_PAGE
  );

  // Search change hole page 1 e ferot jao
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // ---------------- Category-wise Promo (Update/Create) ----------------
  const updateCategoryPromo = async (cat) => {
    const data = promoData[cat];
    if (
      !data?.promoCode ||
      !data?.promoType ||
      !data?.promoValue ||
      !data?.startDate ||
      !data?.endDate
    )
      return alert("All fields required!");

    setUpdatingCat(cat);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/products/updatepromo/category",
        {
          categoryName: cat,
          promoCode: data.promoCode,
          promoType: data.promoType,
          promoValue: Number(data.promoValue),
          promoStartDate: data.startDate,
          promoEndDate: data.endDate,
        }
      );
      alert(res.data.message);
      await fetchCategoryPromos(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Error updating category promo!");
    } finally {
      setUpdatingCat(null);
    }
  };

  // Edit button -> input field e existing promo data bosiye dibe
  const handleEditPromo = (cat) => {
    const existing = categoryPromos[cat];
    if (!existing) return;
    setPromoData({
      ...promoData,
      [cat]: {
        promoCode: existing.promoCode || "",
        promoType: existing.promoType || "",
        promoValue: existing.promoValue?.toString() || "",
        startDate: existing.promoStartDate
          ? existing.promoStartDate.substring(0, 10)
          : "",
        endDate: existing.promoEndDate
          ? existing.promoEndDate.substring(0, 10)
          : "",
      },
    });
  };

  // Delete button -> category promo clear
  const handleDeletePromo = async (cat) => {
    if (!window.confirm(`"${cat}" er promo delete korte chan?`)) return;
    setDeletingCat(cat);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/products/updatepromo/category/delete",
        { categoryName: cat }
      );
      alert(res.data.message);
      await fetchCategoryPromos();
    } catch (err) {
      console.error(err);
      alert("Error deleting promo!");
    } finally {
      setDeletingCat(null);
    }
  };

  // ---------------- All Products Promo ----------------
  const [updatingAll, setUpdatingAll] = useState(false);

  const updateAllPromo = async () => {
    const { promoCode, promoType, promoValue, startDate, endDate } = allPromo;
    if (!promoCode || !promoType || !promoValue || !startDate || !endDate)
      return alert("All fields required!");

    setUpdatingAll(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/products/updatepromo/all",
        {
          allProductPromoCode: promoCode,
          allProductPromoType: promoType,
          allProductPromoValue: Number(promoValue),
          allProductPromoStartDate: startDate,
          allProductPromoEndDate: endDate,
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error updating all products promo!");
    } finally {
      setUpdatingAll(false);
    }
  };

  const pageIsLoading = loadingProducts; // category list layout depends on this

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Promo Management</h1>

      {/* ================= SEARCH BAR ================= */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Category search koro..."
          className="border px-3 py-2 rounded w-full md:w-1/3 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={searchTerm}
          disabled={pageIsLoading}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* ================= CATEGORY PROMO ================= */}
      <h2 className="text-xl font-semibold mb-4">Category-wise Promo</h2>

      {/* 🔄 Skeletons while products load */}
      {pageIsLoading && (
        <>
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
        </>
      )}

      {!pageIsLoading && paginatedCategoryNames.length === 0 && (
        <p className="text-gray-500 mb-4">Kono category paoa jayni.</p>
      )}

      {!pageIsLoading &&
        paginatedCategoryNames.map((cat) => {
          const existingPromo = categoryPromos[cat];
          const isUpdating = updatingCat === cat;
          const isDeleting = deletingCat === cat;

          return (
            <div
              key={cat}
              className="bg-white p-5 mb-4 rounded shadow border transition-opacity duration-300"
            >
              <h3 className="font-semibold mb-3">{cat}</h3>

              {/* ---- Input Row ---- */}
              <div className="flex gap-3 flex-wrap mb-3">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="border px-2 py-1 rounded"
                  value={promoData[cat]?.promoCode || ""}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setPromoData({
                      ...promoData,
                      [cat]: { ...promoData[cat], promoCode: e.target.value },
                    })
                  }
                />
                <select
                  className="border px-2 py-1 rounded"
                  value={promoData[cat]?.promoType || ""}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setPromoData({
                      ...promoData,
                      [cat]: { ...promoData[cat], promoType: e.target.value },
                    })
                  }
                >
                  <option value="">Type</option>
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat (Taka)</option>
                </select>
                <input
                  type="number"
                  placeholder="Value"
                  className="border px-2 py-1 rounded"
                  value={promoData[cat]?.promoValue || ""}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setPromoData({
                      ...promoData,
                      [cat]: { ...promoData[cat], promoValue: e.target.value },
                    })
                  }
                />
                <input
                  type="date"
                  className="border px-2 py-1 rounded"
                  value={promoData[cat]?.startDate || ""}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setPromoData({
                      ...promoData,
                      [cat]: { ...promoData[cat], startDate: e.target.value },
                    })
                  }
                />
                <input
                  type="date"
                  className="border px-2 py-1 rounded"
                  value={promoData[cat]?.endDate || ""}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setPromoData({
                      ...promoData,
                      [cat]: { ...promoData[cat], endDate: e.target.value },
                    })
                  }
                />
                <button
                  className="bg-green-600 text-white px-3 rounded min-w-[90px] flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => updateCategoryPromo(cat)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>

              {/* ---- Applied Promo Table (GET data) ---- */}
              {loadingPromos ? (
                <PromoTableSkeleton />
              ) : existingPromo ? (
                <div className="mt-3 border-t pt-3">
                  <p className="text-sm text-gray-500 mb-2 font-medium">
                    Current Applied Promo:
                  </p>
                  <div className="overflow-x-auto relative">
                    {isDeleting && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded">
                        <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <table className="min-w-full text-sm border rounded">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left border-b">Code</th>
                          <th className="px-3 py-2 text-left border-b">Type</th>
                          <th className="px-3 py-2 text-left border-b">Value</th>
                          <th className="px-3 py-2 text-left border-b">Start</th>
                          <th className="px-3 py-2 text-left border-b">End</th>
                          <th className="px-3 py-2 text-left border-b">Products</th>
                          <th className="px-3 py-2 text-left border-b">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-3 py-2 border-b font-medium">
                            {existingPromo.promoCode}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {existingPromo.promoType}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {existingPromo.promoValue}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {existingPromo.promoStartDate?.substring(0, 10)}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {existingPromo.promoEndDate?.substring(0, 10)}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {existingPromo.productCount}
                          </td>
                          <td className="px-3 py-2 border-b">
                            <div className="flex gap-2">
                              <button
                                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs disabled:opacity-60"
                                onClick={() => handleEditPromo(cat)}
                                disabled={isDeleting}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-60"
                                onClick={() => handleDeletePromo(cat)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  Ei category te kono promo apply kora nai.
                </p>
              )}
            </div>
          );
        })}

      {/* ================= PAGINATION ================= */}
      {!pageIsLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8">
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`px-3 py-1 border rounded ${
                currentPage === num ? "bg-blue-600 text-white" : "bg-white"
              }`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= ALL PRODUCTS PROMO ================= */}
      <h2 className="text-xl font-semibold mb-4 mt-8">All Products Promo</h2>
      <div className="bg-white p-5 rounded shadow border flex gap-3 flex-wrap items-center">
        <input
          type="text"
          placeholder="Promo Code"
          className="border px-2 py-1 rounded"
          value={allPromo.promoCode}
          disabled={updatingAll}
          onChange={(e) => setAllPromo({ ...allPromo, promoCode: e.target.value })}
        />
        <select
          className="border px-2 py-1 rounded"
          value={allPromo.promoType}
          disabled={updatingAll}
          onChange={(e) => setAllPromo({ ...allPromo, promoType: e.target.value })}
        >
          <option value="">Type</option>
          <option value="percent">Percent (%)</option>
          <option value="flat">Flat (Taka)</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          className="border px-2 py-1 rounded"
          value={allPromo.promoValue}
          disabled={updatingAll}
          onChange={(e) => setAllPromo({ ...allPromo, promoValue: e.target.value })}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={allPromo.startDate}
          disabled={updatingAll}
          onChange={(e) => setAllPromo({ ...allPromo, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={allPromo.endDate}
          disabled={updatingAll}
          onChange={(e) => setAllPromo({ ...allPromo, endDate: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-3 rounded min-w-[110px] flex items-center justify-center disabled:opacity-60"
          onClick={updateAllPromo}
          disabled={updatingAll}
        >
          {updatingAll ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating
            </span>
          ) : (
            "Update All"
          )}
        </button>
      </div>
    </div>
  );
}
