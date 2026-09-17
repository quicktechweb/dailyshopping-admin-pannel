import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";

const SuccessPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const name = query.get("name");

  return (
    <div className="p-6 bg-[#113350] text-white min-h-screen flex flex-col items-center justify-center text-center">
      <Confetti className="w-full h-full" />
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4">🎉 Submission Successful 🎉</h2>
      <h3 className="text-lg md:text-xl mb-4">Thank you, {name || "User"}!</h3>

      <p className="text-sm md:text-base max-w-2xl leading-relaxed">
        প্রিয়, <span className="font-bold">{name || "User"}</span> <br />
        আপনার অর্ডারটি আমাদের কাছে অত্যান্ত গুরুত্বপূর্ণ। কষ্টার্জিত টাকার আমানত আপনার এই অর্ডার, আমরা যথা সাধ্য চেষ্টা করবো 
        আপনাকে যাতে কোনো প্রকার ঝামেলার সম্মুখীন হতে না হয়। আমাদের কল সেন্টার থেকে একজন প্রতিনিধি আপনার অর্ডারটি 
        কনফার্ম করার জন্য খুব দ্রুত সময়ের মধ্যে আপনাকে কল করবেন।
      </p>
    </div>
  );
};

export default SuccessPage;
