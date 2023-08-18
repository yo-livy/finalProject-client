import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './Newsfeed.css'
import axios from 'axios';

const API_KEY = process.env.REACT_APP_ACCESS_KEY_ALPHA_VANTAGE
const API_KEY_RAPID = process.env.REACT_APP_ACCESS_KEY_RAPID

const NewsFeed = ({ ticker }) => {
    const [news, setNews] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);

    const formatDate = (dateTimeStr) => {
        const formattedDate = `${dateTimeStr.substring(6, 8)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(0, 4)} ${dateTimeStr.substring(9, 11)}:${dateTimeStr.substring(11, 13)}:${dateTimeStr.substring(13, 15)}`;
        return formattedDate;
    }

    useEffect(() => {
        const fetchAllNews = async () => {
            if (ticker && ticker.length > 0) {
                try {
                    const allNews = [];
                    
                    for (const t of ticker) {
                        console.log(`Fetching ALPHA news ${t}`)
                        const response = await axios(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${t}&apikey=${API_KEY}`);
                        console.log('Response data feed', response.data)
                        allNews.push(...response.data.feed);
                    }
    
                    const sortedNews = allNews.sort((a, b) => new Date(formatDate(b.time_published)) - new Date(formatDate(a.time_published)));
                    setNews(sortedNews);
                } catch (error) {
                    console.error("There was an error fetching the news:", error);
                }
            }
        };
    
        fetchAllNews();
    }, [ticker]);


    const displayedNews = news.slice(0, visibleCount);

    if (ticker.length === 0) {
        return (
            <div className="news-feed">
                <h2 className='nftitle'>NEWS ACCORDING TO YOUR PORTFOLIO STOCKS</h2>
                <p>Your portfolio is empty yet. Fill it to see recent news referred to your stocks</p>
            </div>
        );
    }


    return (
        <>
         <h2 className='nftitle'>NEWS ACCORDING TO YOUR PORTFOLIO STOCKS</h2>
        <div className="news-feed">
           
            <ul>
                {displayedNews.map((article, index) => (
                    <li key={index}><a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>  {formatDate(article.time_published)}</li>
                ))}
            </ul>
            <div>
                {visibleCount > 5 && (
                    <button className="lessmore" onClick={() => setVisibleCount(visibleCount - 5)}>
                        Show Less
                    </button>
                )}
                {visibleCount < news.length && (
                    <button className="lessmore" onClick={() => setVisibleCount(visibleCount + 5)}>
                        Show More
                    </button>
                )}
            </div>
        </div>
        </>
    );
}

export default NewsFeed;