import React, { useState, useEffect, useCallback } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { FaRegStar, FaStar } from "react-icons/fa";
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { WISHLIST_API_END_POINT } from '../utils/constant';

const ChartPage = () => {
    const [selectedSector, setSelectedSector] = useState('Market Indices');
    const [selectedMarket, setSelectedMarket] = useState('BSE');
    const { user } = useSelector(store => store.user);
    const [wishlist, setWishlist] = useState([]);
    const [widgetError, setWidgetError] = useState(false);

    const stocksByCategory = {
        'Market Indices': [
            ["SENSEX", "BSE:SENSEX|1D"],
        
        ],
        'Banking & Finance': [
            ["HDFC Bank", "BSE:HDFCBANK|1D"],
            ["ICICI Bank", "BSE:ICICIBANK|1D"],
            ["State Bank of India", "BSE:SBIN|1D"],
            ["Axis Bank", "BSE:AXISBANK|1D"],
            ["Kotak Bank", "BSE:KOTAKBANK|1D"],
            ["Bajaj Finance", "BSE:BAJFINANCE|1D"],
            ["HDFC Life", "BSE:HDFCLIFE|1D"],
        ],
        'IT & Technology': [
            ["TCS", "BSE:TCS|1D"],
            ["Infosys", "BSE:INFY|1D"],
            ["Tech Mahindra", "BSE:TECHM|1D"],
            ["Wipro Limited", "BSE:WIPRO|1D"],
            ["HCL Tech", "BSE:HCLTECH|1D"],
        ],
        'Energy & Power': [
            ["Reliance Industries", "BSE:RELIANCE|1D"],
            ["Adani Power", "BSE:ADANIPOWER|1D"],
            ["Adani Green Energy", "BSE:ADANIGREEN|1D"],
            ["Adani Total Gas", "BSE:ATGL|1D"],
            ["NTPC", "BSE:NTPC|1D"],
            ["Power Grid", "BSE:POWERGRID|1D"],
        ],
        'Infrastructure': [
            ["Adani Enterprises", "BSE:ADANIENT|1D"],
            ["Adani Ports", "BSE:ADANIPORTS|1D"],
            ["Larsen & Toubro", "BSE:LT|1D"],
            ["ACC", "BSE:ACC|1D"],
            ["Ambuja Cements", "BSE:AMBUJACEM|1D"],
            ["UltraTech Cement", "BSE:ULTRACEMCO|1D"],
        ],
        'Automotive': [
            ["Tata Motors", "BSE:TATAMOTORS|1D"],
            ["Maruti Suzuki", "BSE:MARUTI|1D"],
           
            ["Hero MotoCorp", "BSE:HEROMOTOCO|1D"],
           
        ],
    };

    const globalMarkets = {
        'US Markets': [
           
           
            ["NASDAQ", "NASDAQ:IXIC|1D"],
            ["NYSE", "NYSE:NYA|1D"],
        ],
        'Asian Markets': [
            ["Nikkei 225", "INDEX:NKY|1D"],
            ["Shanghai Composite", "SSE:000001|1D"],
            ["Hang Seng", "HSI:HSI|1D"],
           
        ],
        'European Markets': [
          
            ["DAX", "INDEX:DAX|1D"],
            ["CAC 40", "INDEX:CAC|1D"],
         
        ],
    };

    // Function to get current market data based on selection
    const getCurrentMarketData = () => {
        if (selectedMarket === 'Global') {
            return globalMarkets;
        }
        return stocksByCategory;
    };

    const addToWishlist = async (stockName, stockSymbol, sector) => {
        try {
            if (!user) {
                toast.error("Please login first");
                return;
            }

            const response = await axios.post(`${WISHLIST_API_END_POINT}/add`, {
                stockName,
                stockSymbol,
                sector
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                toast.success("Added to wishlist");
                setWishlist(prev => [...prev, stockSymbol]);
            }
        } catch (error) {
            console.error("Add to wishlist error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                endpoint: `${WISHLIST_API_END_POINT}/add`
            });
            toast.error(error.response?.data?.message || "Error adding to wishlist");
        }
    };

    const removeFromWishlist = async (stockSymbol) => {
        try {
            const response = await axios.delete(`${WISHLIST_API_END_POINT}/remove/${stockSymbol}`, {
                withCredentials: true
            });
            if (response.data.success) {
                toast.success("Removed from wishlist");
                setWishlist(prev => prev.filter(symbol => symbol !== stockSymbol));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error removing from wishlist");
        }
    };

    // Fetch wishlist with error handling
    const fetchWishlist = useCallback(async () => {
        try {
            const response = await axios.get(`${WISHLIST_API_END_POINT}`, {
                withCredentials: true
            });
            if (response.data.success) {
                setWishlist(response.data.wishlist.map(item => item.stockSymbol));
            }
        } catch (error) {
            console.error("Fetch wishlist error:", error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
        
        // Cleanup function
        return () => {
            // Cleanup any TradingView elements that might be left
            const tvElements = document.querySelectorAll('.tradingview-widget-container');
            tvElements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        };
    }, [user, fetchWishlist]);

    // Handle widget error
    const handleWidgetError = () => {
        setWidgetError(true);
        console.error("TradingView widget failed to load");
    };

    // Reset widget error when changing sectors
    useEffect(() => {
        setWidgetError(false);
    }, [selectedSector]);

    return (
        <div className="w-[60%] bg-white">
            {/* Live Sensex Ticker */}
            <div className="border-b border-gray-200">
                <TradingViewWidget showMiniChart={true} />
            </div>

            {/* Header with Market Selection */}
            <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSelectedMarket('BSE')}
                            className={`text-sm font-medium ${
                                selectedMarket === 'BSE' 
                                    ? 'text-black' 
                                    : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            BSE
                        </button>
                        <button
                            onClick={() => setSelectedMarket('NSE')}
                            className={`text-sm font-medium ${
                                selectedMarket === 'NSE' 
                                    ? 'text-black' 
                                    : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            NSE
                        </button>
                        <button
                            onClick={() => setSelectedMarket('Global')}
                            className={`text-sm font-medium ${
                                selectedMarket === 'Global' 
                                    ? 'text-black' 
                                    : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            Global Markets
                        </button>
                    </div>
                    <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Sector Navigation */}
            <div className="overflow-x-auto whitespace-nowrap p-4 border-b border-gray-200">
                <div className="flex space-x-4">
                    {Object.keys(getCurrentMarketData()).map((sector) => (
                        <button
                            key={sector}
                            onClick={() => setSelectedSector(sector)}
                            className={`px-4 py-2 rounded-full text-sm ${
                                selectedSector === sector 
                                    ? 'bg-black text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stock List with Wishlist Icons */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {getCurrentMarketData()[selectedSector]?.map(([name, symbol]) => (
                        <div key={symbol} className="flex items-center justify-between p-2 border rounded">
                            <span>{name}</span>
                            <button
                                onClick={() => {
                                    wishlist.includes(symbol)
                                        ? removeFromWishlist(symbol)
                                        : addToWishlist(name, symbol, selectedSector)
                                }}
                                className="text-yellow-500"
                            >
                                {wishlist.includes(symbol) ? <FaStar /> : <FaRegStar />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trading Widget */}
            <div className="p-4">
                {!widgetError ? (
                    <TradingViewWidget 
                        key={`${selectedMarket}-${selectedSector}-${wishlist.length}`}
                        symbols={getCurrentMarketData()[selectedSector]} 
                        onError={handleWidgetError}
                    />
                ) : (
                    <div className="text-center p-4 bg-gray-100 rounded">
                        <p className="text-gray-600">
                            Unable to load chart. Please try refreshing the page.
                        </p>
                        <button 
                            onClick={() => {
                                setWidgetError(false);
                                window.location.reload();
                            }}
                            className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartPage;
