import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Invest.css";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const Invest = () => {
  const [stockName, setStockName] = useState("");
  const [stocks, setStocks] = useState([]);
  const [cache, setCache] = useState({});
  const [exchange, setExchange] = useState("");
  const [exchanges, setExchanges] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getExchanges = async () => {
      if (cache["exchanges"]) {
        const allExchanges = cache["exchanges"];
        const targetExchanges = allExchanges.filter((exchange) =>
          ["NYSE", "NASDAQ"].includes(exchange.name)
        );
        setExchanges(targetExchanges);
        if (targetExchanges.length > 0) {
          setExchange(targetExchanges[0].code); // Select the name of the first exchange by default
        }
      } else {
        const options = {
          method: "GET",
          url: `https://api.twelvedata.com/exchanges?${process.env.REACT_APP_ACCESS_KEY_12}`,
        };

        try {
          const response = await axios.request(options);
          console.log("Fetching exchanges from Twelve");
          const allExchanges = response.data.data;
          setCache((oldCache) => ({
            ...oldCache,
            ["exchanges"]: allExchanges,
          }));
          const targetExchanges = allExchanges.filter((exchange) =>
            ["NYSE", "NASDAQ"].includes(exchange.name)
          );
          setExchanges(targetExchanges);
          if (targetExchanges.length > 0) {
            setExchange(targetExchanges[0].code); // Select the name of the first exchange by default
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    getExchanges();
  }, []);

  useEffect(() => {
    const getStocks = async () => {
      if (exchange && cache[exchange]) {
        setStocks(cache[exchange]);
      } else if (exchange) {
        const options = {
          method: "GET",
          url: `https://api.twelvedata.com/stocks?${process.env.REACT_APP_ACCESS_KEY_12}`,
          params: {
            exchange: exchange,
          },
        };

        try {
          const response = await axios.request(options);
          console.log("Fetching stocks");
          if (response.data && response.data.data) {
            setCache((oldCache) => ({
              ...oldCache,
              [exchange]: response.data.data,
            }));
            setStocks(response.data.data);
          } else {
            setStocks([]); // reset to empty array if no data
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setStocks([]); // reset to empty array if exchange is not selected
      }
    };

    getStocks();
  }, [exchange]);

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().startsWith(stockName.toLowerCase())
  );

  const handleStockSelection = (stock) => {
    navigate("/stock-details", { state: { stock: stock } });
  };

  const arcx =
    "ARCX (NYSE Arca): Originally known as Archipelago Exchange, NYSE Arca is an electronic securities exchange in the U.S. where both stocks and options are traded. It's one of the primary platforms for ETF (Exchange Traded Fund) trading.";
  const xase =
    "XASE (NYSE American): Formerly known as the American Stock Exchange (AMEX), NYSE American is an American stock exchange situated in New York City. It was acquired by NYSE Euronext in 2008. NYSE American focuses on small to mid-sized companies.";
  const xnys =
    "XNYS (New York Stock Exchange): This is the primary MIC code for the main board of the New York Stock Exchange, the largest equities-based exchange in the world based on the total market capitalization of its listed securities.";

  const xnas =
    "XNAS (NASDAQ Stock Market): This is the main board of the NASDAQ, where many of the largest publicly traded companies are listed, especially tech companies. The NASDAQ Stock Market is known for its electronic trading system and is considered the second-largest stock exchange in the world by market capitalization.";

  const xnms =
    "XNMS (NASDAQ Stock Market - National Market System): The NASDAQ National Market System (NMS) represents the main tier of NASDAQ. Companies listed under this tier must meet higher criteria than those on the NASDAQ Capital Market. The NMS includes many large-cap stocks and is known for major technology companies.";

  const xngs =
    "XNGS (NASDAQ Global Select Market): The NASDAQ Global Select Market is a segment of the NASDAQ Stock Market that has the highest initial listing standards of any exchange in the world. It's a mark of achievement for qualifying public companies. The criteria for listing here involve a mix of quantitative and qualitative evaluations, including financial health, liquidity, and company governance.";

  const xncm =
    "XNCM (NASDAQ Capital Market): Formerly known as the NASDAQ SmallCap Market, the NASDAQ Capital Market is designed for early-stage and smaller companies. It has less stringent listing requirements than the NASDAQ Global Select Market, making it more accessible for smaller or emerging companies. The criteria include certain thresholds for assets, capital, public shares, and shareholders.";

  return (
    <div className="mainInvest">
      <h2 className="investTitle">Make investment</h2>
      <h3 className="invsetSubTitle">Choose exchange and find a stock</h3>
      <div>
        <div className="mainExchanges">
          <FormControl
            variant="outlined"
            className="exchanges"
            sx={{ width: "300px" }}>
            <InputLabel
              id="exchange-label"
              sx={{
                backgroundColor: "white",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}>
              Exchange
            </InputLabel>
            <Select
              labelId="exchange-label"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              label="Exchange">
              {exchanges.map((exchange, index) => (
                <MenuItem key={index} value={exchange.code}>
                  {exchange.name} - {exchange.code} - {exchange.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <select className="exchanges" value={exchange} onChange={(e) => setExchange(e.target.value)}>
            {exchanges.map((exchange, index) => (
              <option key={index} value={exchange.code}>
                {exchange.name} - {exchange.code} - {exchange.country}
              </option>
            ))}
          </select> */}

          <p className="exchangesDescription">
            {exchange === "ARCX"
              ? arcx
              : exchange === "XASE"
              ? xase
              : exchange === "XNYS"
              ? xnys
              : exchange === "XNCM"
              ? xncm
              : exchange === "XNMS"
              ? xnms
              : exchange === "XNGS"
              ? xngs
              : xnas}
          </p>

          <TextField
            variant="outlined"
            className="findstock"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            label="Stock Name"
            placeholder="Enter stock name"
          />

          {/* <input
            className="findstock"
            type="text"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            placeholder="Enter stock name"
          /> */}
        </div>

        <div>
          {filteredStocks.length > 0 ? (
            <div className="allstocks">
              {filteredStocks.map((stock, index) => (
                <div
                  key={index}
                  className="stock"
                  onClick={() => handleStockSelection(stock)}>
                  <p>
                    {stock.name} - {stock.symbol}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="noresults">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invest;
