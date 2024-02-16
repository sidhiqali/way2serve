import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { fireBaseContext } from "../../store/Contexts";
import Preloader from "../preLoader/Preloader";
import "./Signup.css";

function Signup() {
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const { firebasedb } = useContext(fireBaseContext);
  const history = useHistory();

  useEffect(() => {
    handleOffline();
  }, []);
  const handleOffline = () => {
    if (!window.navigator.onLine) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  function showPassword() {
    const passwordInput = document.querySelector("#password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setShowPassword(true);
    } else {
      passwordInput.type = "password";
      setShowPassword(false);
    }
  }
  function checkPassword() {
    const passwordField = document.querySelector("#password");
    const passwordWarning = document.querySelector(".password-warning");
    const submitButton = document.querySelector(".signup-btn");
    if (passwordField.value.length < 8) {
      passwordWarning.innerText = "Enter more than 8 characters !";
      submitButton.disabled = true;
      submitButton.classList.add("submit-disabled");
    } else {
      passwordWarning.innerText = "";
      submitButton.disabled = false;
      submitButton.classList.remove("submit-disabled");
    }
  }
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    firebasedb
      .auth()
      .createUserWithEmailAndPassword(Email, Password)
      .then((res) => {
        res.user.updateProfile({ displayName: Username }).then(() => {
         firebasedb.firestore().collection('users').doc(`${res.user.uid}`).set({
              id: res.user.uid,
              username: Username,
              creationTime: new Date().toGMTString()
          })
        })
      })
      .then(() => {
        setLoading(false);
        history.push("/login");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="signup">
      {loading && <Preloader />}
      <div className="signup-form-container">
        <div className="signup-logo">
          <div className="title1">
              Sign Up
          </div>
        </div>
        <form onSubmit={handleSignupSubmit} className="signup-form">
          <div className="form-controls">
            <input
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              type="text"
              id="username"
              name="username"
              required
            />
            <label htmlFor="username">User Name</label>
          </div>
          <div className="form-controls">
            <input
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              type="email"
              id="email"
              name="email"
              placeholder="e"
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-controls password-controls">
            <input
              value={Password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPassword();
              }}
              className="form-input"
              type="password"
              id="password"
              name="password"
              required
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="eye-icon"
              onClick={showPassword}
              title={ShowPassword ? "Hide Password" : "Show Password"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                className={ShowPassword ? "show-password-svg" : ""}
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
              </svg>
            </button>
          </div>
          <div className="password-warning"></div>

          <button className="signup-btn" type="submit">
            Sign Up
          </button>
        </form>
        <div className="already-member">
          <Link className="login-link-in-form" to="/login">
            Login
          </Link>
        </div>
        {Error && <div className="signup-errors">{Error}</div>}
      </div>
    </div>
  );
}

export default Signup;
