import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../../Pages/HomePage/ScrollToTop/ScrollToTop";
import useAuth from "../../Pages/Hooks/useAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginWithPhoneAndPassadmin,googleSignIn } = useAuth();

  const [phone, setPhone] = useState("");
  // const { googleSignIn } = useFirebase();
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    loginWithPhoneAndPassadmin(phone, password, navigate);
  };

  return (
    <div className="md:mt-7 mt-28 flex items-center  justify-center  mb-5">
      <ScrollToTop />
      <div className="bg-white w-full max-w-md shadow-[0_2px_18px_rgba(0,0,0,0.15)] mb-5 rounded-md flex overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-3/2 p-8">
          <h2 className="text-sm font-bold mb-4">WELCOME TO Lucky Shop</h2>

          {/* Tabs */}
          <div className="flex mb-4">
            {/* <button
              onClick={() => navigate("/login")}
              className={`w-1/2 py-2 text-sm font-semibold border ${
                window.location.pathname === "/login"
                  ? "bg-[#19745B] text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/registration")}
              className={`w-1/2 py-2 text-sm font-semibold border-l ${
                window.location.pathname === "/registration"
                  ? "bg-[#19745B] text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Sign Up
            </button> */}
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Phone Number*"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
                required
              />
            </div>

            <input
              type="password"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
              required
            />

            <label className="flex items-start gap-2 text-xs">
              <Link>
                <span className="text-gray-600">Forgot Your Password?</span>
              </Link>
            </label>

            <button
              type="submit"
              className="w-full font-semibold py-2 rounded-md bg-[#19745B] text-white hover:bg-gray-800"
            >
              Login
            </button>
          </form>

          {/* OR Divider */}
          {/* <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div> */}

          {/* Social Register Buttons */}
          {/* <div className="space-y-2">
            <button   onClick={() => googleSignIn(navigate)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gray-50 hover:border-gray-400">
              <FcGoogle size={18} /> Login with Google
            </button>
          </div> */}
        </div>

        
      </div>
    </div>
  );
}
