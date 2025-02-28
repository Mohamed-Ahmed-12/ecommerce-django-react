import React, { useEffect, useState } from "react";
import { useCart } from "../components/context/CartContext";
import axiosInstance from "../components/axiosInstance";
import { Link } from "react-router-dom";

export default function ShoppingCart() {
  const { cartItems , addCartItem, fetchCartItems, removeCartItem } = useCart();
  useEffect(() => {
    fetchCartItems();
    console.log(cartItems)
  }, [])

  // Increase quantity
  const increaseQuantity = (id , qty) => {
    addCartItem(id , qty+1)
  };
  // Decrease quantity
  const decreaseQuantity = (id , qty) => {
    if(qty > 1) {
      addCartItem(id , qty-1)
    }
  };
 

  // // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container text-center mt-5 vh-100">
                <h3>Your cart is empty</h3>
                <p>Please add items to your cart to proceed with the checkout.</p>
                <Link to="/store" className="bi bi-arrow-left">
                    {" "}
                    Back To Store
                </Link>
            </div>
        );
    }
  return (
    <div className="container mt-4 vh-100">
      <h3 className="mb-3">🛒 Shopping Cart</h3>
      <div className="table-responsive" id="cart-table">
      <table className="table">
        <thead className="bg-light">
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>

          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td className="d-flex">
                <img src={`${axiosInstance.defaults.baseURL.replace("/api/", "") + item.product.image}`} style={{ width: "125px", height: "100px" }} alt={item.name} className='img-thumbnail' />
                <span className="ms-2 product-name">{(item.product.name).slice(0, 50)}</span>
              </td>
              <td className="product-price">${item.product.price.toFixed(2)}</td>
              <td className="product-qty">
                <button className="btn btn-sm btn-primary me-2" onClick={()=> decreaseQuantity(item.product.id , item.quantity)} >-</button>
                <span>{item.quantity}</span>
                <button className="btn btn-sm btn-primary ms-2" onClick={()=>increaseQuantity(item.product.id , item.quantity)}>+</button>
              </td>
              <td className="product-total">${(item.product.price * item.quantity).toFixed(2)}</td>
              <td><button className='btn btn-sm btn-danger bi bi-trash' onClick={() => { removeCartItem(item.product.id) }}></button></td>

            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <h5>Total: ${totalPrice.toFixed(2)}</h5>
        <Link className="btn btn-dark" to='/checkout'>Checkout</Link>
      </div>
    </div>
  );
}

// [
//   {
//     "id": 50,
//     "product": {
//       "id": 2,
//       "category": {
//         "id": 9,
//         "name": "Electronics",
//         "image": "/media/categories/electronics.png"
//       },
//       "brand": {
//         "id": 7,
//         "name": "MSI",
//         "img": "/media/brands/msi.png"
//       },
//       "compatibility": [
//         {
//           "id": 1,
//           "model_name": "W"
//         }
//       ],
//       "reviews": [
//         {
//           "id": 11,
//           "user": {
//             "id": 7,
//             "username": "Anas",
//             "email": "anashamadaabdo@gmail.com"
//           },
//           "review": "very good i suggest it for any one",
//           "rating": 5,
//           "created_at": "2025-01-15T21:54:25.198989Z",
//           "updated_at": "2025-01-15T21:54:25.198989Z",
//           "product": 2
//         },
//         {
//           "id": 12,
//           "user": {
//             "id": 1,
//             "username": "admin",
//             "email": ""
//           },
//           "review": "gooooood",
//           "rating": 5,
//           "created_at": "2025-01-15T22:10:19.058422Z",
//           "updated_at": "2025-02-07T08:45:03.711739Z",
//           "product": 2
//         },
//         {
//           "id": 18,
//           "user": {
//             "id": 6,
//             "username": "adel",
//             "email": "fcaisssads@gmail.com"
//           },
//           "review": "vgood",
//           "rating": 3,
//           "created_at": "2025-02-07T08:44:27.170304Z",
//           "updated_at": "2025-02-07T08:45:16.819014Z",
//           "product": 2
//         }
//       ],
//       "name": "MSI Thin 15 B13UCX Gaming Laptop Intel Core I7-13620H 16GB Ram 512GB SSD Nvidia RTX 2050 GDDR6 4GB, PCIe4 WiFi 6E 15.6 FHD 144HZ Win 11 Home Gray English/Arabic Black",
//       "name_ar": "MSI Thin 15 B13UCX Gaming Laptop Intel Core I7-13620H 16GB Ram 512GB SSD Nvidia RTX 2050 GDDR6 4GB, PCIe4 WiFi 6E 15.6 FHD 144HZ Win 11 Home Gray English/Arabic Black",
//       "partnumber": "9S7-16R831-2491",
//       "description": "-Brands MSI, MSI Thin\r\n    -MPN : 9S7-16R831-2491\r\n    - CPU : Raptor Lake i7-13620H\r\n    -Graphics :RTX 2050 4GB, GDDR6 4GB\r\n    -Memory : DDR IV 8GB*2 (3200MHz)\r\n    -Storage : 512GB NVMe PCIe SSD Gen4x4\r\n    -OS : Windows® 11 Home A\r\n    -Processor Core i7\r\n    -Generation 13th\r\n    -VGA 2050\r\n    -Resolution 1920×1080 Pixels\r\n    -Refresh Rate 144 Hz",
//       "description_ar": "MSI Thin 15 B13UCX Gaming Laptop Intel Core I7-13620H 16GB Ram 512GB SSD Nvidia RTX 2050 GDDR6 4GB, PCIe4 WiFi 6E 15.6 FHD 144HZ Win 11 Home Gray MPN : 9S7-16R831-2491 CPU : Raptor Lake i7-13620H Graphics :RTX 2050 4GB, GDDR6 4GB Memory : DDR IV 8GB*2 (3200MHz) Storage : 512GB NVMe PCIe SSD Gen4x4 OS : Windows® 11 Home A Brands MSI, MSI Thin Processor Core i7 Generation 13th VGA 2050 Resolution 1920×1080 Pixels Refresh Rate 144 Hz",
//       "price": 35999,
//       "old_price": 38999,
//       "image": "/media/products/1024.png",
//       "image2": "/media/products/1025.png",
//       "image3": "/media/products/1026.png",
//       "slug": "msi-thin-15-b13ucx-gaming-laptop-intel-core-i7-13620h-16gb-ram-512gb-ssd-nvidia-rtx-2050-gddr6-4gb-pcie4-wifi-6e-156-fhd-144hz-win-11-home-gray-englisharabic-black",
//       "condition": "new",
//       "quantity": 100,
//       "created_at": "2025-01-01T23:51:29.655240Z"
//     },
//     "quantity": 10,
//     "created_at": "2025-02-07T10:31:01.629877Z",
//     "order": 40
//   }
// ]