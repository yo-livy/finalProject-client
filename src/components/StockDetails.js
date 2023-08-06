import { useState, useEffect } from "react";
import axios from 'axios';
import Buy from "./Buy";
import Sell from "./Sell";

const StockDetails = ({ stock }) => {
    const [details, setDetails] = useState(null);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [msg, setMsg] = useState('');

    const fetchStockQuote = async () => {
        const options1 = {
            method: 'GET',
            url: `https://twelve-data1.p.rapidapi.com/quote`,
            params: {
                format: 'json',
                symbol: stock.symbol,
                exchange: stock.exchange
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_ACCESS_KEY_RAPID,
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };

        try {
            const response1 = await axios.request(options1);
            console.log('Fetching quote');
            setDetails(response1.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStockPrice = async () => {
        console.log('Refresh price')
        const options2 = {
            method: 'GET',
            url: 'https://twelve-data1.p.rapidapi.com/price',
            params: {
                symbol: stock.symbol,
                format: 'json',
                outputsize: '30'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_ACCESS_KEY_RAPID,
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };

        try {
            const response2 = await axios.request(options2);
            console.log('Fetching price');
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
            console.log('Unmount');
        };
    }, []);

    return (
        <div>
            {details ? (
                <>
                    <h3>{details.name} ({details.symbol})</h3>
                    <p>Price: {price} {details.currency}</p>
                    <p>Quantity:</p>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                    <Buy price={price} stock={stock} quantity={quantity} setMsg={setMsg}/><Sell price={price} stock={stock} quantity={quantity} setMsg={setMsg}/>
                    <p>{msg ? msg : null}</p>
                    <p><a href={`https://www.google.com/finance/quote/${stock.symbol}:${stock.exchange}`} target="_blank" rel="noopener noreferrer">Detail info</a></p>
                    <p>Exchange: {details.exchange}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default StockDetails;


