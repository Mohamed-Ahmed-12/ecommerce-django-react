// CartContext.js
import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get("/cart/",
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                }
            );
            console.log("Fetched cart items:", response.data); // Debugging log
            setCartItems(response.data || []);
        } catch {
            console.error("Failed to fetch cart items.");
            setCartItems([]);
        }
    };

    const addCartItem = async (productId , itemQty = 1) => {
        try {
            // Item Qty is positive number
            if (itemQty <= 0) {
                toast.error("Please enter valid positive number, Try again", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return; // Exit the function early
            }
            // Check if the item already exists in the cart
            const itemExists = cartItems.some(item => item.product.id === productId);
            if (itemExists) {
                toast.info("Product already in cart!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return; // Exit the function early
            }
            const token = localStorage.getItem("access_token");
            const response = await axiosInstance.post(`cart/product/add/${productId}/`,
                {itemQty}, // Empty body if not required
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Correctly set the Authorization header
                    },
                }
            );
            // Re-fetch cart items to ensure the state is accurate
            await fetchCartItems();

            // Success toast
            toast.success("Item added to cart successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            console.log(response.data);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            // Error toast
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
                    Authorization: `Bearer ${token}`, // Correctly set the Authorization header
                },
            });
    
            // Success toast
            toast.info("Item removed from cart!", {
                position: "top-right",
                autoClose: 3000,
            });
    
            // Update the cart items
            const updatedCartItems = cartItems.filter((item) => item.product.id !== productId);
            setCartItems(updatedCartItems);
    

    
        } catch (error) {
            console.error("Failed to remove item:", error);
            // Error toast
            toast.error("Failed to remove item from cart. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };
    
    return (
        <CartContext.Provider value={{ cartItems, fetchCartItems, addCartItem, removeCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
