// CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Fetch cart items when component mounts or cartItems state changes
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (token){
                const response = await axiosInstance.get("/cart/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetched cart items:", response.data); // Debugging log
                setCartItems(response.data || []);
            }
           
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
            setCartItems([]);
        }
    };

    const addCartItem = async (productId, itemQty = 1) => {
        try {
            if (itemQty <= 0) {
                toast.error("Please enter a valid positive number, Try again", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }
            let itemExists = false;
            if(cartItems.length > 0){
                const itemExists = cartItems.some(item => item.product.id === productId);
            }

            const token = localStorage.getItem("access_token");
            const url = `cart/product/add/${productId}/`;

            const response = await axiosInstance.post(url, { itemQty }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (itemExists) {
                toast.success("Item in cart updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.success("Item added to cart successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            await fetchCartItems(); // Ensure the cart items are up-to-date

        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Failed to add item to cart. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const removeCartItem = async (productId) => {
        try {
            const token = localStorage.getItem("access_token");
            await axiosInstance.delete(`cart/product/delete/${productId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.info("Item removed from cart!", {
                position: "top-right",
                autoClose: 3000,
            });

            await fetchCartItems(); // Ensure cart items are updated after removal

        } catch (error) {
            console.error("Failed to remove item:", error);
            toast.error("Failed to remove item from cart. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // Fetch cart items when the component mounts or updates
    useEffect(() => {
        fetchCartItems();
    }, []); // Empty dependency array to fetch on component mount only

    return (
        <CartContext.Provider value={{ cartItems, fetchCartItems, addCartItem, removeCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
