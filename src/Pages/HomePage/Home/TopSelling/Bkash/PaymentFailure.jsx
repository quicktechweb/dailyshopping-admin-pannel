import { useSearchParams } from "react-router-dom";

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const reason = params.get("reason");
  return (
    <div className="p-8">
      <h2>Payment Failed ❌</h2>
      <p>Reason: {reason || "Unknown"}</p>
    </div>
  );
}
