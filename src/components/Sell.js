import { useState, useContext } from 'react';
import UserContext from '../UserContext';
import axios from 'axios';

const Sell = ({ stock, price, quantity, setMsg }) => {

    const { user } = useContext(UserContext);

    const handleSubmit = async () => {
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3030/sell', {
                userid: user.id,
                symbol: stock.symbol,
                price: price,
                quantity: Number(quantity)
            }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
    
            if (response.status === 200) {
                setMsg('Selling made successfully');
            }
        } catch (error) {
            console.log(error.response.data.message);
            setMsg(error.response.data.message);
        }
    };

    return (
            <button onClick={handleSubmit}>Sell</button>
    );
};

export default Sell;