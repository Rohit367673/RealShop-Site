// components/Signup.jsx
import React, { useState, useContext } from "react";
import { AiFillMail, AiOutlineKey, AiFillContacts } from "react-icons/ai";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";



function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Pass, setPassword] = useState('');
  const [Number, setNumber] = useState('');

  const submitHandle = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", { Name, Email, Pass, Number })
      .then((res) => {
        if (res.data.message === "success") {
          const userData = { Name, Email, Number, Pass, id: res.data.id };
          login(res.data.token, userData);
          navigate("/account",{state:userData});
          toast.success("Registration successful!");
        } else {
          console.log(res.data.message);
          toast.error(res.data.message || "Registration failed!");
        }
      })
      .catch((err) => {
        console.log("Something went wrong. Please try again.");
        console.error("Signup error:", err);
        toast.error("Registration failed!");
      });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);
      console.log("Decoded Google User:", decoded);

      // Send the token to the backend for verification and user creation/login
      const res = await axios.post("http://localhost:3001/google-signup", {
        token: credential,
      });

      if (res.data.message === "success") {
        const { token, user } = res.data;
        const userData = {
          Name: user.Name,
          Email: user.Email,
          Number: user.Number || "",
          id: user._id,
          ProfilePic: user.ProfilePic || "",
        };
        login(token, userData);
        navigate("/account", {state: userData});
        toast.success("Google Sign-Up successful!");
      } else {
        toast.error(res.data.message || "Google Sign-Up failed!");
      }
    } catch (error) {
      console.error("Google Sign-Up error:", error);
      toast.error("Google Sign-Up failed!");
    }
  };

  const handleGoogleFailure = () => {
    console.log('Google Sign-In was unsuccessful.');
    toast.error("Google Sign-In failed!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="box bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={submitHandle}>
        <h1 className="text-center mb-6 text-3xl font-semibold">Sign Up</h1>
        <div className="input mb-4 flex items-center border-b border-gray-300">
          <FiUser className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Enter Username"
            required
            value={Name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
        </div>
        <div className="input mb-4 flex items-center border-b border-gray-300">
          <AiFillMail className="mr-2 text-gray-600" />
          <input
            type="email"
            placeholder="Enter Email-Id"
            required
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
        </div>
        <div className="input mb-4 flex items-center border-b border-gray-300">
          <AiFillContacts className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Enter Number"
            required
            value={Number}
            onChange={(e) => setNumber(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
        </div>
        <div className="input mb-6 flex items-center border-b border-gray-300 relative">
          <AiOutlineKey className="mr-2 text-gray-600" />
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            required
            value={Pass}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
          <div className="eye absolute right-0 top-0 mt-2 mr-2">
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
          Sign Up
        </button>
        <p className="mt-4 text-center">
          I have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
        <div className="flex justify-center mt-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </form>
    </div>
  );
}

export default Signup;
