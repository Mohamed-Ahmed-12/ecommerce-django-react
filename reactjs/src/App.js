import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"; // Assume this file contains your styles

import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import Forms from './pages/Forms';
import Error404 from './pages/Error404';

import Nav from "./components/Navbar";
import Home from "./pages/Home";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from "./components/context/CartContext";

import { useAuthContext } from "./components/context/AuthContext";
import Checkout from "./pages/Checkout";
import { PaymentCancel, PaymentSuccess } from "./pages/Payment";
import Orders from "./pages/Orders";
import ConfirmOrderMessage from "./components/ConfirmOrderMessage";


// Protected Route Component > allow authenticated user 
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated , loading } = useAuthContext();
  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
}
  // Redirect to login if not authenticated
  if (!isAuthenticated) {

    return <Navigate to="/login" replace />;
  }

  return children;

};

// Public Route Component > allow unauthenticated user 
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
      return <div>Loading...</div>; // Show a loading spinner or message
  }
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Component 
function App() {
  const { isAuthenticated } = useAuthContext();

  // useEffect(() => {
  //       // Cleanup function to hide the modal occurs when the modal backdrop (the dark overlay) is not properly removed when navigating away from the page containing the modal. This can happen if the modal wasn't properly dismissed before the navigation occurred.
  //       return () => {
  //           const modalBackdrop = document.querySelector('.modal-backdrop');
  //           if (modalBackdrop) {
  //               modalBackdrop.remove(); // Remove the backdrop manually
  //           }
  //       };
  //   }, []);

  return (

    <CartProvider>
      <BrowserRouter>
        <div className="container-fluid">
          <ToastContainer />
          {isAuthenticated && <Nav />}
          
        </div>
        <Routes>
          <Route path="*" element={<Error404 />} />          
          <Route path="/login" element={<PublicRoute><Forms/></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/store" element={<ProtectedRoute><Store/></ProtectedRoute>} />
          <Route path="/product/:slug" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/payment/cancel" element={<ProtectedRoute><PaymentCancel  /></ProtectedRoute>} />
          <Route path="/order/success" element={<ProtectedRoute><ConfirmOrderMessage  /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>

  );
}

export default App;
