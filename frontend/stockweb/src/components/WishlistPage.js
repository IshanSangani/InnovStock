import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WISHLIST_API_END_POINT } from '../utils/constant';
import TradingViewWidget from './TradingViewWidget';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const [wishlistStocks, setWishlistStocks] = useState([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            console.log("Fetching wishlist...");
            const response = await axios.get(`${WISHLIST_API_END_POINT}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Wishlist response:", response.data);
            if (response.data.success) {
                setWishlistStocks(response.data.wishlist);
            }
        } catch (error) {
            console.error("Fetch error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error("Error fetching wishlist");
        }
    };

    const removeFromWishlist = async (stockSymbol) => {
        try {
            console.log("Removing from wishlist:", stockSymbol);
            const response = await axios.delete(`${WISHLIST_API_END_POINT}/remove/${stockSymbol}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Remove response:", response.data);
            if (response.data.success) {
                toast.success("Removed from wishlist");
                fetchWishlist();
            }
        } catch (error) {
            console.error("Remove error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error("Error removing from wishlist");
        }
    };

    return (
        <div className="w-[60%] bg-white p-4">
            <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>
            
            {wishlistStocks.length === 0 ? (
                <p className="text-gray-500">No stocks in your watchlist yet.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {wishlistStocks.map((stock) => (
                            <div key={stock.stockSymbol} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <h3 className="font-semibold">{stock.stockName}</h3>
                                    <p className="text-sm text-gray-500">{stock.sector}</p>
                                </div>
                                <button
                                    onClick={() => removeFromWishlist(stock.stockSymbol)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <TradingViewWidget 
                        symbols={wishlistStocks.map(stock => [stock.stockName, stock.stockSymbol])}
                    />
                </>
            )}
        </div>
    );
};

export default WishlistPage; 