import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="p-6 bg-white shadow-lg rounded-2xl text-center">
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">
          Payment Cancelled ⚠️
        </h1>
        <p className="text-gray-600 mb-4">You have cancelled the transaction.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
