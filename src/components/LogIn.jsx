import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LogIn() {
  // สร้างstate form เก็บค่าที่ input จากผู้ใช้ แล้วเก็บค่าที่อัปเดตแล้วใน setForm
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  // navigate ใช้เปลี่ยนหน้า
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // ตรวจสอบ อีเมล
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
          password: "Password ต้อง 6 ตัวขึ้นไป",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ถ้ายังมี error ก็ไม่ไปหน้า home
    if (errors.email || errors.password || !form.email || !form.password) {
      alert("กรุณากรอกข้อมูลให้ถูกต้อง");
      return;
    }

    console.log("LogIn Data:", form);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-yellow-800 text-white flex-col justify-center items-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">Log in</h2>
          <p className="text-lg mb-6">
            Welcome back! Continue where you left off and keep your notes
            organized.
          </p>
          <img
            src="https://illustrations.popsy.co/pink/engineer.svg"
            alt="Illustration"
            className="w-72 mx-auto "
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Don’t have an account?{" "}
            <Link
              to="#"
              className="text-yellow-800 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition mb-6 "
          >
            <img
              src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            Log in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* กรอกข้อมูล */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-yellow-400 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-yellow-400 focus:outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
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
