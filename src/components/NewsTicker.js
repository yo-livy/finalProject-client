import { useState, useEffect } from 'react';
import './NewsTicker.css';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_ACCESS_KEY_RAPID

const NewsTicker = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews= async () => {
      const options = {
        method: 'GET',
        url: 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/ne/news',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
        }
      };
      
      try {
        console.log('Fetching news YF news ...')
        const response = await axios.request(options);
        setNewsData(response.data); 
      } catch (error) {
        console.error(error);
      }  
    }

    fetchNews();
  }, []);

  return (
    <div className="news-ticker">
      <p>
        {newsData.map(item => item.title).join('   |   ')}
        &nbsp;&nbsp;&nbsp;&nbsp;
        {newsData.map(item => item.title).join('   |   ')}
      </p> 
    </div>
  );  
};

export default NewsTicker;
