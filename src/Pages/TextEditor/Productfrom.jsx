// src/pages/ProductForm.jsx
import React, { useState } from "react";
import TextEditor from "./TextEditor";

export default function ProductForm() {
  const [description, setDescription] = useState("");

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">📝 Product Description</h2>

      {/* ✅ Reusable Editor Component */}
      <TextEditor value={description} onChange={setDescription} />

      <button
        onClick={() => console.log(description)}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Save
      </button>

     
    </div>
  );
}
