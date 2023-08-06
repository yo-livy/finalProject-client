import React, { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext.js";
import { Link } from 'react-router-dom'
import axios from "axios";



const Dashboard = () => {
    const {user} = useContext(UserContext);
    const [cash, setCash] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [visibleTransactions, setVisibleTransactions] = useState(3);
    const [showAll, setShowAll] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            console.log('Refresh data')
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3030/portfolio/${user.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                setCash(parseFloat(response.data.user.cash));
                setPortfolioValue(parseFloat(response.data.portfolioValue));
                setTransactions(response.data.transactions);
                setStocks(response.data.userStocks);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 300000);
        return () => clearInterval(intervalId);
        
    }, [user.id]);

    const handleToggleTransactions = () => {
        if (showAll) {
            setShowAll(false);
            setVisibleTransactions(3);
        } else {
            setShowAll(true);
            setVisibleTransactions(transactions.length);
        }
    };


    return (
    <div>
        <h2>Dashboard</h2>
        <p>Welcome, {user.username}!</p>
        <p>Cash Balance: {cash.toFixed(2)} USD</p>
        <p>Stock portfolio Value: {portfolioValue.toFixed(2)} USD</p>
        <p>Total: {(cash + portfolioValue).toFixed(2)} USD</p>
        {/* <Link to="/invest">
            <button>Make an Investment</button>
        </Link> */}
        <h3>Your Stocks</h3>
        <ul>
            {stocks
            .map((stock, index) => (
            <li key={index}>
                {stock.symbol} - {stock.quantity} shares
            </li>
            ))}
        </ul>
        <h3>Recent Transactions</h3>
            <ul>
                {transactions.slice(0, visibleTransactions).map((transaction, index) => (
                    <li key={index}>
                        {transaction.transactiontype} {transaction.stockid} {transaction.price} USD {transaction.quantity} shares {transaction.timestamp}
                    </li>
                ))}
            </ul>
            {transactions.length > 3 && (
                <button onClick={handleToggleTransactions}>
                    {showAll ? "Show less" : "Show more"}
                </button>
            )}
    </div>
    );
}

export default Dashboard;