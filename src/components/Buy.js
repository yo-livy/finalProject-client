import { useState, useContext } from "react";
import UserContext from "../UserContext";
import axios from "axios";
import loadingImg from '../images/loading.gif'

const Buy = ({
  stock,
  price,
  quantity,
  setMsg,
  setQuantity,
  setUserStockAmount,
  setQuantityAfterBuy,
  cost,
  setUserCash,
}) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/buy`,
        {
          userid: user.id,
          exchange: stock.exchange,
          company_name: stock.name,
          symbol: stock.symbol,
          price: price,
          quantity: Number(quantity),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data)
        setMsg("Purchase made successfully");
        setUserStockAmount((prevState) => prevState + Number(quantity));
        setQuantity("");
        // setQuantityAfterBuy(false)
        // const updatedPercentage = ((stock.stockValue + cost) / ((userCash) + userPortfolio)) * 100;
        // setUpdatedStockPercentage(updatedPercentage);
        setUserCash((prevState) => prevState - Number(cost));
      }
    } catch (error) {
      console.log(error.response.data.message);
      setMsg(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return <button className="purchaseBtn" onClick={handleSubmit} disabled={loading}>{loading ? <img style={{width:'25px', height:'25px'}} src={loadingImg} alt="Loading" /> : 'Buy' }</button>;
};

export default Buy;
