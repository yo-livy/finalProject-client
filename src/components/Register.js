import axios from "axios";
import { useState, useContext } from "react";
import UserContext from "../UserContext.js";
import "./LoginRegister.css";
import loadingImg from "../images/loading.gif";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState(""); // New state for the repeated password
  const [error, setError] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  

  const register = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const newUser = { username, password };
      const response = await axios.post(
        `${BASE_URL}/register`,
        newUser
      );
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log(localStorage);
    } catch (error) {
      setError(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="titleDiv">
        <h1 className="title">MONEYSPACE</h1>
        <div className="desc">
          <p>Long-term & mid-term investment app</p>
        </div>
      </div>
      <div className="signin">
        {loading ? (
          <img
            style={{ width: "65px", height: "65px" }}
            src={loadingImg}
            alt="Loading"
          />
        ) : (
          <div className="formDiv">
            <form onSubmit={register} className="in-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <input
                type="password"
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => {
                  setRepeatPassword(e.target.value);
                  setError("");
                }}
              />
              <button type="submit">Sign up</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        )}

        <p className="quote">“Every man lives by exchanging” Adam Smith</p>
      </div>
    </div>
    // <div>
    //     <h2>Register</h2>
    //     {error && <p>{error}</p>}
    //     <form onSubmit={register}>
    //         <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    //         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //         <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
    //         <button type='submit'>Register</button>
    //     </form>
    // </div>
  );
};

export default Register;
