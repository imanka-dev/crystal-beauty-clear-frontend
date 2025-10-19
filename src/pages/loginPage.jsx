import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // CHANGED: correct initial value
  const navigate = useNavigate();

  function handleLogin() {
    // CHANGED: start loading immediately
    setLoading(true);

    axios
      .post(import.meta.env.VITE_URL + "/api/user/login", {
        email,
        password,
      })
      .then((response) => {
        // CHANGED: stop loading (if navigating, component may unmount but safe to set)
        setLoading(false);

        // Defensive: ensure response.data exists
        const data = response.data || {};

        // CHANGED: check server response properly
        if (data.success === false || data.message === "Invalid email") {
          console.log("Login failed", data);
          toast.error(data.message || "Login failed");
          return;
        }

        // Success
        console.log("Login successful", data);
        toast.success("Login successful");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Redirect based on user role
        const user = data.user || {};
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        // CHANGED: stop loading on error too
        setLoading(false);

        if (error.response) {
          console.log("Login failed", error.response.data);
          toast.error(error.response.data?.message || "Login failed");
        } else {
          console.log("Error:", error.message);
          toast.error("An error occurred. Please try again.");
        }
      });

    console.log("Login button clicked");
  }

  return (
    <div className="w-full  h-screen bg-[url(/login-bg.jpg)] bg-cover bg-center flex">
      <div className=" w-[50%] h-full"></div>

      <div className=" w-[50%] h-full flex justify-center items-center">
        <div className="w-[450px] h-[600px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="email"
            placeholder="email"
          />

          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="password"
          />

          {/* CHANGED: disable button while loading and show feedback */}
          <button
            onClick={handleLogin}
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-gray-600 text-center m-[10px]">
            Don't have an account yet?
            <span className="text-blue-500 ml-2 cursor-pointer" onClick={() => navigate("/register")}>
              <Link to="/register">Register Now</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
