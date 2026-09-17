import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ForgotPassword({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP, 3 = New Password
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!/^\d{11}$/.test(phone)) {
      Swal.fire({ icon: "warning", title: "Invalid phone number", toast: true, position: "top-end", timer: 2000 });
      return;
    }
    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/auth/forgot-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: "success", title: "OTP Sent", toast: true, position: "top-end", timer: 2000 });
        setStep(2);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message, toast: true, position: "top-end", timer: 2000 });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Server error", toast: true, position: "top-end", timer: 2000 });
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/auth/forgot-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: "success", title: "OTP Verified", toast: true, position: "top-end", timer: 2000 });
        setStep(3);
      } else {
        Swal.fire({ icon: "error", title: "Invalid OTP", toast: true, position: "top-end", timer: 2000 });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Server error", toast: true, position: "top-end", timer: 2000 });
    }
  };

  // ✅ Reset password
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Swal.fire({ icon: "warning", title: "Password too short", toast: true, position: "top-end", timer: 2000 });
      return;
    }
    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: "success", title: "Password Updated", toast: true, position: "top-end", timer: 2000 });
        setStep(1);
        setPhone("");
        setOtp("");
        setNewPassword("");
        onClose();
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message, toast: true, position: "top-end", timer: 2000 });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Server error", toast: true, position: "top-end", timer: 2000 });
    }
  };

  // ✅ OTP resend timer
  useEffect(() => {
    if (step === 2) {
      setTimer(30);
      setCanResend(false);
      const interval = setInterval(() => {
        setTimer(prev => {
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
  }, [step]);

  const handleResendOtp = async () => {
    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/auth/forgot-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: "success", title: "OTP Resent", toast: true, position: "top-end", timer: 2000 });
        setTimer(30);
        setCanResend(false);
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Server error", toast: true, position: "top-end", timer: 2000 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold">&times;</button>
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        {/* Step 1: Phone */}
        {step === 1 && (
          <>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border px-4 py-3 rounded-md mb-4 focus:ring-2 focus:ring-[#19745B]"
            />
            <button onClick={handleSendOtp} className="w-full bg-[#19745B] text-white py-3 rounded-md font-semibold hover:bg-[#14543C]">
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <p className="text-gray-600 mb-3 text-center">Enter the 6-digit OTP sent to your phone</p>
            <div className="flex justify-between mb-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  maxLength={1}
                  type="text"
                  className="w-12 h-12 border rounded-md text-center text-lg font-semibold focus:ring-2 focus:ring-[#19745B]"
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (!value) return;
                    const newOtp = otp.split("");
                    newOtp[idx] = value;
                    setOtp(newOtp.join(""));
                    if (idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
              {!canResend ? (
                <span>Resend OTP in <span className="font-semibold">{timer}s</span></span>
              ) : (
                <button onClick={handleResendOtp} className="text-[#19745B] font-semibold underline">Resend OTP</button>
              )}
            </div>
            <button onClick={handleVerifyOtp} className="w-full bg-[#19745B] text-white py-3 rounded-md font-semibold hover:bg-[#14543C]">
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border px-4 py-3 rounded-md mb-4 focus:ring-2 focus:ring-[#19745B]"
            />
            <button onClick={handleResetPassword} className="w-full bg-[#19745B] text-white py-3 rounded-md font-semibold hover:bg-[#14543C]">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

ForgotPassword.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};