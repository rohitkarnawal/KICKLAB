import { useState } from "react";
import axios from "axios";
import "./AuthModal.css";

function AuthModal({ mode, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(mode === "login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            email,
            password,
          }
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        onAuthSuccess(response.data.user);
        onClose();
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`,
          {
            name,
            email,
            password,
          }
        );

        alert("Account created successfully. Please log in.");

        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        <div className="auth-logo">KICKLAB</div>

        <h2>
          {isLogin ? "Log in to your account" : "Create your account"}
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Get personalised picks & faster checkout"
            : "Join KICKLAB for a better shopping experience"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;