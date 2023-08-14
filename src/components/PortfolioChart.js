import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { format } from "date-fns";
import moment from 'moment';
import './PortfolioChart.css'


import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale);


function PortfolioChart({ userId, userPortfolio, userCash }) {
  const [data, setData] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/daily_portfolio/${userId}`);
        const standardizedData = response.data.map(item => ({
            date: format(new Date(item.date), 'yyyy-MM-dd'),
            value: Number(item.value)
        }));
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().slice(0, 10);

        // Retrieve the portfolio value from local storage and convert it to a number
        const currentStockValue = userPortfolio;
        const currentUserCash = userCash;
        const currentPortfolioValue = Number(currentStockValue + currentUserCash);

        // Add today's date and the current portfolio value to the data
        const updatedData = [...standardizedData, { date: today, value: currentPortfolioValue }];
        
        setData(updatedData);
      } catch (error) {
        console.error("Error fetching daily portfolio data:", error);
      }
    }
    
    fetchData();
  }, [userId]);

  const chartData = {
    labels:  data.map(item => item.date),
    datasets: [
        {
            label: 'Portfolio Value',
            data: data.map(item => item.value),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
    ]
};

const options = {
  // maintainAspectRatio: false,
  responsive: true,
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'day',
                displayFormats: {
                    day: 'DD/MM/YYYY'
                }
            }
        }
    }
};


  return (
    <>

      <h3 className='charttitle'>YOUR PORTFOLIO VALUE CHART</h3>
      <div className='mainChart'>
       
        <Line data={chartData} options={options} />
      </div>
    </>


    
  );
}

export default PortfolioChart;
