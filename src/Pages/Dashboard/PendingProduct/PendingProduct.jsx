import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

const PendingProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the server
  useEffect(() => {
    fetch(`http://localhost:5000/products`) // Replace with your API URL
      .then((res) => res.json())
      .then((data) => {
        // Filter pending products
        const pendingProducts = data.filter(
          (product) => product.productStatus === "pending"
        );
        setProducts(pendingProducts);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Update product status to approved
  const handleApprove = (id) => {
    fetch(`http://localhost:5000/approvedproducts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productStatus: "approved" }),
    })
      .then((res) => res.json())
      .then(() => {
        // Remove the approved product from the state
        const updatedProducts = products.filter((product) => product._id !== id);
        setProducts(updatedProducts);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/pendingdatsdelete/${id}`)
          .then((response) => {
            response.status === 204 &&
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            const deleted = products.filter((d) => d._id !== id);
            setProducts(deleted);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Products</h1>
      {products.length === 0 ? (
        <p>No pending products to show.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gradient-to-r from-[#01c0c9] to-[#007cde] text-white">
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">SubCategory</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Condition</th>
                <th className="border border-gray-300 px-4 py-2">Brand</th>
                <th className="border border-gray-300 px-4 py-2">Model</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={product.images[0] || "https://via.placeholder.com/150"}
                      alt={product.category}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.subCategory}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.price} Taka</td>
                  <td className="border border-gray-300 px-4 py-2">{product.condition}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.model}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleApprove(product._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                     <button
                                            onClick={() => handleDelete(product?._id)}
                                            className="w-10 mt-3 h-10 ml-4 rounded-full flex items-center justify-center bg-[#007cde] text-white text-xl duration-300 active:scale-90"
                                          >
                                            <MdOutlineDeleteOutline />
                                          </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingProduct;
