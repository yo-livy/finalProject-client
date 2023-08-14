import React, { useState, useContext, useEffect, useMemo } from "react";
import UserContext from "../UserContext.js";
import axios from "axios";
import "../components/Dashboard.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import NewsFeed from "./Newsfeed.js";
import PortfolioChart from "./PortfolioChart.js";
import "./Dashboard.css";
import green from "../images/green.png";
import red from "../images/red.png";
import greenred from "../images/greenred.png";
import NewsTicker from "./NewsTicker.js";
import loadingImg from "../images/loading.gif";


const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState(null);
  const [cash, setCash] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [percentCash, setPercentCash] = useState(0);
  const [visibleTransactions, setVisibleTransactions] = useState(5);

  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Refresh DASHBOARD data");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/portfolio/${user.id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setDate(
          format(new Date(response.data.user.created_date), "dd MMM yyyy")
        );
        setCash(parseFloat(response.data.user.cash));
        localStorage.setItem("userCash", parseFloat(response.data.user.cash));
        setPortfolioValue(parseFloat(response.data.portfolioValue));
        localStorage.setItem(
          "userPortfolio",
          parseFloat(response.data.portfolioValue)
        );
        setPercentCash(parseFloat(response.data.percentCash));
        setTransactions(response.data.transactions);
        setStocks(response.data.userStocks);
        setIsLoading(false);

        await axios.post(
          `${BASE_URL}/portfolio/compute`,
          { userId: user.id },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, [user.id]);

  const total = cash + portfolioValue;

  const handleStockSelection = (stock) => {
    console.log(stock);
    navigate("/stock-details", { state: { stock: stock } });
  };

  const tickers = useMemo(() => stocks.map((item) => item.symbol), [stocks]);
  const formatNum = (num) => {
    const num1 = Number(num.toFixed(2));
    const num2 = num1.toLocaleString("en-US", { useGrouping: true });
    const num3 = num2.replace(/,/g, " ");
    return num3;
  };
  const percent = formatNum((total / 1000000 - 1) * 100);
  const notPercent = formatNum(total - 1000000) + " USD";


  const PercentDisplay = React.memo(() => {
    const [isUp, setIsUp] = useState(true);
    const toggleIsUp = () => {
      setIsUp((prevIsUp) => !prevIsUp);
    };
  
    return (
      <span className="percent" onClick={toggleIsUp}>
        {isUp ? percent + "%" : notPercent}
      </span>
    );
  });


  
  let colors = [
    "linear-gradient(45deg, #FF5757 0%, #8c52FF 100%)",
    "linear-gradient(45deg, #5170FF 0%, #FF66C4 100%)",
    "linear-gradient(45deg, #004AAD 0%, #CB6CE6 100%)",
    "linear-gradient(45deg, #004AAD 0%, #5DE0E6 100%)",
    "linear-gradient(45deg, #8C52FF 0%, #00BF63 100%)",
    "linear-gradient(45deg, #FF914D 0%, #FDD32B 100%)",
    "linear-gradient(45deg, #8C52FF 0%, #5CE1E6 100%)",
    "linear-gradient(45deg, #FF66C4 0%, #FFDE59 100%)",
    "linear-gradient(45deg, #8C52FF 0%, #FF914D 100%)",
  ];

  let index = 0;

  const getNextColor = () => {
    const color = colors[index];
    index = (index + 1) % colors.length; // Move to the next index, or wrap around if at the end
    return color;
  };

  const tooltipTextCash = `Cash balance: 💵 ${formatNum(
    cash
  )} USD 💼 ${formatNum(percentCash)}%`;

  return (
    <>
      <NewsTicker />
      <div className="mainDash">
        <div className="totalDiv">
          <span className="total">{formatNum(total)} USD</span>
          &nbsp;&nbsp;&nbsp;
          <img
            src={percent > 0 ? green : percent < 0 ? red : greenred}
            className="arrow"
          />
          <PercentDisplay />
        </div>
        <p className="since">Since {date}</p>
        <div className="cashData">
          <p>
            <span className="invert">YOUR CASH:</span> {formatNum(cash)}{" "}
            <span className="invert">USD</span>
            {formatNum((cash / (cash + portfolioValue)) * 100)}
            <span className="invert">%</span>
          </p>
          <p>
            <span className="invert">YOUR STOCKS:</span>{" "}
            {formatNum(portfolioValue)} <span className="invert">USD</span>
            {formatNum((portfolioValue / (cash + portfolioValue)) * 100)}
            <span className="invert">%</span>
          </p>
        </div>

        <div className="onmap">
          <div>
            {isLoading ? (
              <div className="loadingIndicator">
                <img
                  style={{ width: "45px", height: "45px" }}
                  src={loadingImg}
                  alt="Loading"
                />
              </div>
            ) : (
              <div className="map">
                <div
                  className="square cashbalance tooltip"
                  style={{ width: `${percentCash}%` }}
                  data-tooltip={tooltipTextCash}>
                  <p>
                    Cash balance: 💵 {formatNum(cash)} USD 💼{" "}
                    {formatNum(percentCash)}%
                  </p>
                </div>

                {stocks.map((stock, index) => {
                  const widthPercentage = (stock.stockValue / total) * 100;
                  const tooltipText = `${stock.name} 💵 ${formatNum(
                    stock.stockValue
                  )} USD 💼 ${formatNum(widthPercentage)}%`;
                  return (
                    <div
                      key={index}
                      className="square tooltip"
                      style={{
                        width: `${widthPercentage}%`,
                        backgroundImage: getNextColor(),
                      }}
                      data-tooltip={tooltipText}
                      onClick={() => handleStockSelection(stock)}>
                      {widthPercentage >= 7 && tooltipText.length <= 60 && (
                        <p>
                          {stock.name} 💵 {formatNum(stock.stockValue)} USD 💼{" "}
                          {formatNum(widthPercentage)}%
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {portfolioValue && cash ? (
          <PortfolioChart
            userId={user.id}
            userPortfolio={portfolioValue}
            userCash={cash}
          />
        ) : null}
        <div className="trx">
          <h3 className="trxtitle">RECENT TRANSACTIONS</h3>
          <ul>
            {transactions
              .slice(0, visibleTransactions)
              .map((transaction, index) => (
                <div key={index}>
                  {transaction.transactiontype === "BUY" ? "💼  " : "💵  "}
                  {transaction.timestamp} / {transaction.transactiontype} /{" "}
                  {transaction.company_name} /{transaction.stockid}/ price:{" "}
                  {transaction.price} USD / amount: {transaction.quantity}{" "}
                  shares / total:{" "}
                  {formatNum(transaction.price * transaction.quantity)} USD
                </div>
              ))}
          </ul>
          <div>
            {visibleTransactions > 5 && (
              <button
                className="lessmore"
                onClick={() =>
                  setVisibleTransactions((prevVisible) => prevVisible - 5)
                }>
                Show Less
              </button>
            )}
            {visibleTransactions < transactions.length && (
              <button
                className="lessmore"
                onClick={() =>
                  setVisibleTransactions((prevVisible) => prevVisible + 5)
                }>
                Show More
              </button>
            )}
          </div>
        </div>

        <NewsFeed ticker={tickers} />
      </div>
      <footer className="dashfooter">
        Created by Evgeny Livschitz. Developers Insitute Tel Aviv. Final
        project. August 2023.
      </footer>
    </>
  );
};

export default Dashboard;
