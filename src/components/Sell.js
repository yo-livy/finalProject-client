import { useState, useContext } from "react";
import UserContext from "../UserContext";
import axios from "axios";
import loadingImg from '../images/loading.gif'

const Sell = ({
  stock,
  price,
  quantity,
  setMsg,
  setQuantity,
  setUserStockAmount,
  cost,
  setUserCash,
  refreshUserData
}) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/sell`,
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
        setMsg("Selling made successfully");
        // setUserStockAmount((prevState) => prevState - Number(quantity));
        setQuantity("");
        // setUserCash((prevState) => prevState + Number(cost));
        refreshUserData();
      }
    } catch (error) {
      console.log(error.response.data.message);
      setMsg(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return <button className="purchaseBtn" onClick={handleSubmit} disabled={loading}>{loading ? <img style={{width:'25px', height:'25px'}} src={loadingImg} alt="Loading" /> : 'Sell' }</button>;
};

export default Sell;
