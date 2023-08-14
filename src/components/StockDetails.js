import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Buy from "./Buy";
import Sell from "./Sell";
import { useLocation } from "react-router-dom";
import './StockDetail.css'
import loadingImg from '../images/loading.gif'

import UserContext from "../UserContext";

const StockDetails = () => {
  const location = useLocation();
  const stock = location.state?.stock;

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [userCash, setUserCash] = useState(JSON.parse(localStorage.getItem("userCash")));
  const userPortfolio = JSON.parse(localStorage.getItem("userPortfolio"));

  const [userStockAmount, setUserStockAmount] = useState(stock.quantity || 0);

  const [details, setDetails] = useState(null);
  const [price, setPrice] = useState(null); //Fetched from api
  const [quantity, setQuantity] = useState(""); //From input field
  const [msg, setMsg] = useState("");

  const [operation, setOperation] = useState("Buy"); // Default to Buy
  const [cost, setCost] = useState(0); //Cost of transaction
  const [resultantCash, setResultantCash] = useState(userCash); //Cash after the transaction
  const [updatedStockPercentage, setUpdatedStockPercentage] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const [quantityAfterBuy, setQuantityAfterBuy] = useState(false); //From input field

  const [loading, setLoading] = useState(false);


  //////////////////////

  const { user } = useContext(UserContext);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/portfolio/${user.id}`, // Assuming this endpoint provides the required data
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
  
      // Assuming the response has the required data
      const updatedCash = parseFloat(response.data.user.cash);
      setUserCash(updatedCash);
      localStorage.setItem("userCash", updatedCash);
  
      const updatedStockAmount = response.data.userStocks.find(s => s.symbol === stock.symbol).quantity;
      setUserStockAmount(updatedStockAmount);

      const stockResponse = await axios.get(
        `https://api.twelvedata.com/quote?symbol=${stock.symbol}&exchange=${stock.exchange}&apikey=${process.env.REACT_APP_ACCESS_KEY_12}`
    );
    setDetails(stockResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  //////////////////////


  useEffect(() => {
    const totalCost = price * quantity;
    setCost(totalCost);

    const updateCash =
      operation === "Buy" ? userCash - totalCost : userCash + totalCost;
    setResultantCash(updateCash);

    const currentStockValue = stock.stockValue; // Get it from stock object (key 'stockValue')

    const newStockValue =
      operation === "Buy"
        ? currentStockValue + totalCost
        : currentStockValue - totalCost;
    

    const stockPercentage = (newStockValue / (userCash + userPortfolio)) * 100;
    setUpdatedStockPercentage(stockPercentage);

    if (operation === "Buy" && totalCost > userCash) {
      setWarningMessage("Insufficient funds");
    } else if (operation === "Sell" && quantity > userStockAmount) {
      setWarningMessage("Insufficient stocks");
    } else {
      setWarningMessage("");
    }
  }, [quantity, price, userCash, userStockAmount, userPortfolio, operation]);

  const fetchStockQuote = async () => {
    const options1 = {
      method: "GET",
      url: `https://api.twelvedata.com/quote?symbol=${stock.symbol}&exchange=${stock.exchange}&apikey=${process.env.REACT_APP_ACCESS_KEY_12}`
    };
    try {
      const response1 = await axios.request(options1);
      console.log(`Fetching quote 12 info ${stock.symbol}...`);
      setDetails(response1.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStockPrice = async () => {
    console.log("Refresh price");
    const options2 = {
      method: "GET",
      url: `https://api.twelvedata.com/price?symbol=${stock.symbol}&apikey=${process.env.REACT_APP_ACCESS_KEY_12}`
    };

    try {
      const response2 = await axios.request(options2);
      console.log(`Fetching price from 12 price ${stock.symbol}...`);
      setPrice(parseFloat(response2.data.price));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStockQuote();
  }, [stock]);

  useEffect(() => {
    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, 60000);
    return () => {
      clearInterval(interval);
      console.log("Unmount");
    };
  }, []);

  const formatNum = (num) => {
    try {
      const num1 = Number(num.toFixed(2));
      const num2 = num1.toLocaleString('en-US', { useGrouping: true });
      const num3 = num2.replace(/,/g, ' ');
      return num3;
    } catch (error) {
      console.log('FormatNum Error', error)
    }
  }

  if (!stock) {
    return <div>No stock data available.</div>;
  }

  return (
    <div className="mainDetail">
      {details ? (
        <>
          <h3 className="quoteTitle">
            {details.name} ({details.symbol})
          </h3>
          <div className="card">
              <p>Choose your transaction type</p>
              <div className="purchase">
               
                <button
                  onClick={() => setOperation("Buy")}
                  className={operation === "Buy" ? "selected" : ""}>
                  Buy
                </button> or
                <button
                  onClick={() => setOperation("Sell")}
                  className={operation === "Sell" ? "selected" : ""}>
                  Sell
                </button>
              </div>
              <div className="lineContainer">
                <p>Total Cash: ${loading ? <img style={{width:'25px', height:'25px'}} src={loadingImg} alt="Loading" /> : formatNum(userCash)}</p>
              <p>Stocks Owned: {loading ? <img style={{width:'25px', height:'25px'}} src={loadingImg} alt="Loading" /> : userStockAmount}</p>
              </div>
              <p className="price">
                Price: {formatNum(price)} {details.currency}
              </p>
                <p>Transaction cost: ${formatNum(cost)}</p>
                <p>Cash after transaction: ${formatNum(resultantCash)}</p>
              {/* <p>
                Updated Stock Percentage of Portfolio: {updatedStockPercentage.toFixed(2)}%
              </p> */}
              <div className="quantity">
                  <p>Amount:</p>
                <input
                  type="number"
                  min="1" step="1"
                  value={quantityAfterBuy ? quantity : ''}
                  onChange={(e) => {setQuantity(e.target.value); setQuantityAfterBuy(true); setMsg('')}}
                />
              </div>
          
              {operation === "Buy" ? (
                <Buy
                  price={price}
                  stock={stock}
                  quantity={quantity}
                  setMsg={setMsg}
                  setQuantity={setQuantity}
                  setUserStockAmount={setUserStockAmount}
                  // setUpdatedStockPercentage={setUpdatedStockPercentage}
                  // setQuantityAfterBuy={setQuantityAfterBuy}
                  cost={cost}
                  setUserCash={setUserCash}
                  // userCash={userCash}
                  // userPortfolio={userPortfolio}
                  refreshUserData={fetchUserData}
                />
              ) : (
                <Sell
                  price={price}
                  stock={stock}
                  quantity={quantity}
                  setMsg={setMsg}
                  setQuantity={setQuantity}
                  setUserStockAmount={setUserStockAmount}
                  cost={cost}
                  setUserCash={setUserCash}
                  refreshUserData={fetchUserData}
                />
              )}
               {warningMessage && <p style={{ color: "red" }}>{warningMessage}</p>}
              <p>{msg ? msg : null}</p>
          </div>
          <div className="lineContainer">
            <a
              href={`https://www.google.com/finance/quote/${stock.symbol}:${stock.exchange}`}
              target="_blank"
              rel="noopener noreferrer">
              Detail info
            </a> <br/>
            <a
              href={`https://trends.google.com/trends/explore?q=${(stock.name).replace(/,/g, "")}&hl=ru`}
              target="_blank"
              rel="noopener noreferrer">
              Google Trends
            </a>
          <p>Exchange: {details.exchange}</p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StockDetails;
