import React, { useState, useContext } from "react";
import { AiFillMail, AiOutlineKey, AiFillContacts } from "react-icons/ai";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

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
          navigate("/account");
          toast.success("Registration successful!");
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Something went wrong. Please try again.");
        console.error("Signup error:", err);
      });
     
  };
 
  return (
    <form className="box" onSubmit={submitHandle}>
      <h1 className="text-center mb-10 text-5xl">Sign Up</h1>
      <div className="input">
        <FiUser />
        <input
          type="text"
          placeholder="Enter Username"
          required
          value={Name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input">
        <AiFillMail />
        <input
          type="email"
          placeholder="Enter Email-Id"
          required
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input">
        <AiFillContacts />
        <input
          type="text"
          placeholder="Enter Number"
          required
          value={Number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      <div className="input">
        <AiOutlineKey />
        <input
          type={show ? "text" : "password"}
          placeholder="Enter Password"
          required
          value={Pass}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="eye">
          <button type="button" onClick={() => setShow(!show)}>
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>
      <button type="submit" className="btn">Sign Up</button>
      <p className="ml-40">
        I have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default Signup;
