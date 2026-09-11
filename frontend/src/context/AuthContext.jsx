import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, setCartItems } from "../redux/cartSlice";
import { apiRequest } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("userInfo")) || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (!user?._id) return;

        try {
            const savedCart = JSON.parse(localStorage.getItem(`cartItems:${user._id}`) || "[]");
            dispatch(setCartItems(savedCart));
        } catch {
            dispatch(setCartItems([]));
        }
    }, [dispatch, user?._id]);

    useEffect(() => {
        if (user?._id) {
            localStorage.setItem(`cartItems:${user._id}`, JSON.stringify(cartItems));
        }
    }, [cartItems, user?._id]);

    const login = (userData) => {
        let savedCart = [];
        try {
            savedCart = JSON.parse(localStorage.getItem(`cartItems:${userData._id}`) || "[]");
        } catch {
            savedCart = [];
        }
        const mergedCart = [...cartItems];
        savedCart.forEach((savedItem) => {
            const existingItem = mergedCart.find((item) => (item._id || item.id) === (savedItem._id || savedItem.id));
            if (existingItem) existingItem.qty = (existingItem.qty || 1) + (savedItem.qty || 1);
            else mergedCart.push(savedItem);
        });
        dispatch(setCartItems(mergedCart));
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    };

    const register = async (formData) => {
        return apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(formData),
        });
    };

    const verifyEmail = async (email, otp) => {
        const data = await apiRequest("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ email, otp }),
        });

        login(data);
        return data;
    };

    const logout = () => {
        if (user?._id) {
            localStorage.setItem(`cartItems:${user._id}`, JSON.stringify(cartItems));
        }
        setUser(null);
        dispatch(clearCart());
        localStorage.removeItem("userInfo");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};