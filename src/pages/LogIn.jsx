import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LogIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // ตรวจสอบ email
    if (name === "email") {
      if (!value.includes("@") || !value.endsWith(".com")) {
        setErrors((prev) => ({ ...prev, email: "Email ต้องมี @ และ .com" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    // ตรวจสอบ password
    if (name === "password") {
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Password ต้องมี 6 ตัวขึ้นไป",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.email || errors.password || !form.email || !form.password) {
      alert("กรุณากรอกข้อมูลให้ถูกต้อง");
      return;
    }

    // สามารถเช็คกับ localStorage users ได้เหมือน Register
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => (u.email === form.email || u.username === form.email) && u.password === form.password
    );

    if (!user) {
      setErrors({
        email: "Email หรือ username หรือ password ไม่ถูกต้อง",
        password: "Email หรือ username หรือ password ไม่ถูกต้อง",
      });
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Illustration */}
      <div className="hidden lg:flex w-1/2 bg-yellow-800 text-white flex-col justify-center items-center p-12">
        <h2 className="text-3xl font-bold mb-4">Log in</h2>
        <p className="text-lg mb-6">
          Welcome back! Continue where you left off and keep your notes organized.
        </p>
        <img
          src="https://illustrations.popsy.co/pink/engineer.svg"
          alt="Illustration"
          className="w-72 mx-auto"
        />
      </div>

      {/* Right Form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-yellow-800 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="text"
                name="email"
                placeholder="Email or Username"
                value={form.email}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-800 text-white py-3 rounded-full font-semibold hover:bg-yellow-600 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
