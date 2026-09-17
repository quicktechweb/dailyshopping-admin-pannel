import axios from "axios";

const API_BASE = "https://dailyshopping-backend.onrender.com/api"; // Replace with your backend URL

// Fetch all suppliers
export const fetchSuppliers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/suppliers`);
    return response.data; // assuming backend returns { data: [...] }
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
};

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/products`);
    return response.data; // assuming backend returns { data: [...] }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Create a new purchase
export const createPurchase = async (purchaseData) => {
  try {
    const response = await axios.post(`${API_BASE}/purchases`, purchaseData);
    return response.data;
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
};
