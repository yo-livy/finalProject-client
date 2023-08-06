import { useState, useEffect } from "react";
import axios from "axios";
import StockDetails from './StockDetails.js'

const Invest = () => {
    const [stockName, setStockName] = useState('');
    const [stocks, setStocks] = useState([]);
    const [cache, setCache] = useState({});
    const [exchange, setExchange] = useState('');
    const [exchanges, setExchanges] = useState([]);


    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        const getExchanges = async () => {
            if (cache['exchanges']) {
                const allExchanges = cache['exchanges'];
                const targetExchanges = allExchanges.filter(exchange => ['NYSE', 'NASDAQ'].includes(exchange.name));
                setExchanges(targetExchanges);
                if(targetExchanges.length > 0) {
                    setExchange(targetExchanges[0].name);  // Select the name of the first exchange by default
                }
            } else {
                const options = {
                    method: 'GET',
                    url: 'https://twelve-data1.p.rapidapi.com/exchanges',
                    params: {format: 'json'},
                    headers: {
                        'X-RapidAPI-Key': process.env.REACT_APP_ACCESS_KEY_RAPID,
                        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
                    }
                };
        
                try {
                    const response = await axios.request(options);
                    console.log('Fetching exchanges');
                    const allExchanges = response.data.data;
                    setCache(oldCache => ({ ...oldCache, ['exchanges']: allExchanges }));
                    const targetExchanges = allExchanges.filter(exchange => ['NYSE', 'NASDAQ'].includes(exchange.name));
                    setExchanges(targetExchanges);
                    if(targetExchanges.length > 0) {
                        setExchange(targetExchanges[0].name);  // Select the name of the first exchange by default
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
                    method: 'GET',
                    url: `https://twelve-data1.p.rapidapi.com/stocks`,
                    params: {
                        format: 'json',
                        exchange: exchange,
                    },
                    headers: {
                        'X-RapidAPI-Key': process.env.REACT_APP_ACCESS_KEY_RAPID,
                        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
                    }
                };

                try {
                    const response = await axios.request(options);
                    console.log('Fetching stocks');
                    if (response.data && response.data.data) {
                        setCache(oldCache => ({ ...oldCache, [exchange]: response.data.data }));
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
    }, [exchange, cache]);

    const filteredStocks = stocks.filter(stock => stock.name.toLowerCase().startsWith(stockName.toLowerCase()));

    return (
        <div>
            <h2>Invest in a Stock</h2>
            <select value={exchange} onChange={e => setExchange(e.target.value)}>
                {exchanges.map((exchange, index) => (
                    <option key={index} value={exchange.code}>{exchange.name} - {exchange.code} - {exchange.country}</option>
                ))}
            </select>
            <input type="text" value={stockName} onChange={e => setStockName(e.target.value)} placeholder="Enter stock name" />
            
            {selectedStock ? (
            <>
                <button onClick={() => setSelectedStock(null)}>Close</button>
                <StockDetails stock={selectedStock} />
            </>
        ) : (
            <>
                {filteredStocks.length > 0 ? (
                    <ul>
                        {filteredStocks.map((stock, index) => (
                            <li key={index} onClick={() => setSelectedStock(stock)}>
                                {stock.name} - {stock.symbol}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </>
        )}
        </div>
    );
};

export default Invest;