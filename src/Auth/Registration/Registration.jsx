import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import ScrollToTop from "../../Pages/HomePage/ScrollToTop/ScrollToTop";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../Pages/Hooks/useAuth";
import { nanoid } from "nanoid";

export default function Registration() {
  const currentPath = window.location.pathname;
  const navigate = useNavigate();
  const { googleSignIn } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [timer, setTimer] = useState(30);
const [canResend, setCanResend] = useState(false);


  const [showOtpModal, setShowOtpModal] = useState(false);

  // ❗ When clicking Register: STEP 1 = Send OTP
  const handleRegisterClick = async (e) => {
    e.preventDefault();

    if (!/^\d{11}$/.test(phone)) {
      Swal.fire("Invalid!", "Enter valid 11-digit Bangladeshi phone number", "warning");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    // 🔹 Send OTP first
    try {
      const res = await fetch(`http://localhost:5000/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = await res.json();

      if (data.success) {
        setShowOtpModal(true); // 🔥 Show OTP Modal
        Swal.fire("OTP Sent!", "Check your phone for the OTP", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error while sending OTP", "error");
    }
  };

  // ❗ Verify OTP → Register user
 const verifyOtpAndRegister = async () => {
  try {
    // OTP verify (same)
    const res = await fetch(`http://localhost:5000/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, otp }),
    });

    const data = await res.json();
    if (!data.success) {
      Swal.fire("Error", data.message || "Invalid OTP", "error");
      return;
    }

    // Register user
    const myrefferalcode = `REF-${nanoid(8).toUpperCase()}`;
    const regRes = await fetch(`http://localhost:5000/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: phone,
        password,
        displayName: phone,
        referralCode: referral || "",
        myrefferalcode,
        newpartuser: "user",
      }),
    });

    const regData = await regRes.json();
    if (regData.success) {
      Swal.fire(
        "Success!",
        `Account created!\nYour Referral Code: ${myrefferalcode}`,
        "success"
      );
      navigate("/");
    } else {
      Swal.fire("Error", regData.message || "Registration failed", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Server error while verifying OTP", "error");
  }
};


  useEffect(() => {
  if (showOtpModal) {
    setTimer(30);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }
}, [showOtpModal]);


  const handleResendOtp = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("OTP Sent!", "A new OTP has been sent.", "success");
      setTimer(30);
      setCanResend(false);
    } else {
      Swal.fire("Error", data.message || "Failed to resend OTP", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Server error while resending OTP", "error");
  }
};

  return (
    <div className="md:mt-7 mt-28 mb-36 md:mb-0 flex items-center justify-center bg-gray-50">
      <ScrollToTop />
      <div className="bg-white w-full max-w-4xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] rounded-md flex overflow-hidden">

        {/* Left Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-sm font-bold mb-4">WELCOME TO Lucky Shop</h2>

          {/* Tabs */}
          <div className="flex mb-4">
            <button onClick={() => navigate("/login")}
              className={`w-1/2 py-2 text-sm font-semibold ${currentPath === "/login" ? "bg-black text-white" : "bg-gray-200 text-black"}`}
            >
              Log In
            </button>
            <button onClick={() => navigate("/registration")}
              className={`w-1/2 py-2 text-sm font-semibold ${currentPath === "/registration" ? "bg-[#19745B] text-white" : "bg-gray-200 text-black"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegisterClick}>
            <input
              type="tel"
              placeholder="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />

            <input
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />

            <input
              type="text"
              placeholder="Referral Code (Optional)"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />

            <button
              type="submit"
              className="w-full bg-[#19745B] text-white py-2 rounded-md font-semibold"
            >
              Register
            </button>
          </form>

          {/* OR */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={() => googleSignIn(navigate)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md"
          >
            <FcGoogle size={20} />
            Register with Google
          </button>
        </div>

        {/* Right Side */}
         <div className="hidden md:flex flex-col justify-between w-1/2 bg-white border-1 border-gray-200 p-8 text-sm">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-green-600">✅ Delivering in 10000+ Cities</p>
            <p className="flex items-center gap-2 text-green-600">✅ Presence in 6 Continents</p>
            <p className="flex items-center gap-2 text-green-600">✅ 100 Million Products</p>
            <p className="flex items-center gap-2 text-green-600">✅ 10 Million Happy Customers & Counting</p>

            {/* QR Section */}
            <div className="flex mt-10 items-start">
              <div>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=sellular-app"
                  alt="QR Code"
                  className="w-20 h-20"
                />
              </div>
              <div className="ms-5">
                <p className="mt-2 font-bold">DON’T HAVE SELLAR APP?</p>
                <p>Download it here!</p>
                <p>Scan the QR code</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
     {showOtpModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white w-80 p-6 rounded-md shadow-lg">

      <div className="flex items-center mb-4">
        <img
          className="w-10 h-8"
          src="https://i.ibb.co.com/93rLFnrF/Logo-Lucky-Shop-2.png"
          alt="logo"
        />
        <h2 className="text-xs font-bold ms-2">
          Enter the 6-digit OTP sent to your phone
        </h2>
      </div>

      {/* OTP BOXES */}
      <div className="flex justify-between mb-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <input
            key={idx}
            maxLength={1}
            type="text"
            className="w-10 h-10 border rounded-md text-center text-lg font-semibold focus:outline-[#19745B]"
            id={`otp-${idx}`}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (!value) return;

              const newOtp = otp.split("");
              newOtp[idx] = value;
              setOtp(newOtp.join(""));

              if (idx < 5) {
                document.getElementById(`otp-${idx + 1}`).focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && idx > 0) {
                if (!otp[idx]) {
                  document.getElementById(`otp-${idx - 1}`).focus();
                }
              }
            }}
          />
        ))}
      </div>

      {/* RESEND SECTION */}
      <div className="text-center mb-3">
        {!canResend ? (
          <p className="text-xs text-gray-500">
            Resend OTP in <span className="font-bold">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-[#19745B] text-xs font-semibold underline"
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* SUBMIT */}
      <button
        onClick={verifyOtpAndRegister}
        className="w-full bg-[#19745B] text-white py-2 rounded-md font-semibold"
      >
        Verify & Register
      </button>
    </div>
  </div>
)}

    </div>
  );
}
