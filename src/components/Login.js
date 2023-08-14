import axios from "axios";
import { useState, useContext } from "react";
import UserContext from "../UserContext.js";
import "./LoginRegister.css";
import loadingImg from "../images/loading.gif";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { user, setUser } = useContext(UserContext);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = { username, password };
      const response = await axios.post(`${BASE_URL}/login`, user);
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
            alt="Loading..."
          />
        ) : (
          <div className="formDiv">
            <form onSubmit={login} className="in-form">
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
              <button type="submit">Sign in</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        )}

        <p className="quote">“Every man lives by exchanging” Adam Smith</p>
      </div>
    </div>
  );
};

export default Login;
