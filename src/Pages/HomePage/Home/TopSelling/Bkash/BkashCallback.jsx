import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function BkashCallback() {
  const [params] = useSearchParams();

  useEffect(() => {
    const paymentID = params.get("paymentID");
    const status = params.get("status");

    if (status === "success" && paymentID) {
      axios.post("https://dailyshopping-backend.onrender.com/api/coupons/execute", { paymentID, status })
        .then((res) => {
          alert("✅ Payment successful!");
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
          alert("❌ Payment failed or server error.");
        });
    } else {
      alert("❌ Payment was canceled or failed.");
    }
  }, []);

  return <div className="text-center text-lg mt-10">Processing your payment...</div>;
}
