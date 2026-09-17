import  { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL এর query parameters থেকে payment তথ্য আনো
  const query = new URLSearchParams(location.search);
  const paymentID = query.get("paymentID");
  const trxID = query.get("trxID");
  const status = query.get("status");
  const amount = query.get("amount");

  useEffect(() => {
    if (status === "success") {
      Swal.fire({
        title: "🎉 Payment Successful!",
        html: `
          <p><b>Transaction ID:</b> ${trxID}</p>
          <p><b>Amount:</b> ${amount} BDT</p>
        `,
        icon: "success",
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        navigate("/dashboard"); // যেখানে redirect করতে চাও
      });
    } else {
      Swal.fire({
        title: "❌ Payment Failed",
        text: "Your transaction could not be completed.",
        icon: "error",
        confirmButtonText: "Try Again",
      }).then(() => {
        navigate("/");
      });
    }
  }, [status, trxID, amount, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      {status === "success" ? (
        <div className="p-6 bg-white shadow-lg rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful ✅</h2>
          <p className="text-gray-600 mb-4">Your payment was completed successfully.</p>
          <p><b>Transaction ID:</b> {trxID}</p>
          <p><b>Amount:</b> {amount} BDT</p>
        </div>
      ) : (
        <div className="p-6 bg-white shadow-lg rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Failed ❌</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default Success;
