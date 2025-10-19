// RegisterPage.jsx
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  // Fields based on your mongoose schema (no default-only fields)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password) {
      toast.error("All fields are required");
      return false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      };

      console.log("Register payload:", payload);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/register`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data || {};
      console.log("Register response:", data);

      if (data.success === false) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // If backend returns token, store it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message || "Registered successfully");
      // Redirect to login (or auto-login to dashboard if backend returned token and you want that)
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      if (err.response) {
        toast.error(err.response.data?.message || "Registration failed");
      } else {
        toast.error("Network error — please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[url(/login-bg.jpg)] bg-cover bg-center flex">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <form
          onSubmit={handleRegister}
          className="w-[450px] h-[760px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create account</h2>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="text"
            placeholder="First Name"
            disabled={loading}
          />

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="text"
            placeholder="Last Name"
            disabled={loading}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="email"
            placeholder="Email"
            disabled={loading}
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="tel"
            placeholder="Phone Number"
            disabled={loading}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="Password"
            disabled={loading}
          />

          {/* Confirm password field added */}
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="Confirm Password"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-[400px] h-[50px] ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
            } text-white rounded-xl mt-2 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-gray-600 text-center m-[10px]">
            Already have an account?
            <span className="text-blue-500 ml-2 cursor-pointer" onClick={() => navigate("/login")}>
              <Link to="/login">Login Now</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
