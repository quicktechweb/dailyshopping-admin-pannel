import SupplierForm from "./SupplierForm";

export default function SupplierPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-center text-2xl font-bold mb-6">Add Supplier</h1>
      <SupplierForm />
    </div>
  );
}
