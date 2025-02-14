import React from 'react';
import {formatDate} from '../utilities'
export default function RecentOrders({ orders }) {
    const styleTh = {
        color: "#ff6c2f",
        whiteSpace: "nowrap", // Prevents text from wrapping into multiple lines
        wordWrap: 'break-word', /* Ensures long words break */
        minWidth: '100px', /* Ensures readable columns */
    };

    return (
        <div className="table-responsive mt-4" id="recent-orders">
            <table className="table table-borderedless table-sm">
                <thead className="table-light">
                    <tr>
                        <th style={styleTh}>Order ID</th>
                        <th style={styleTh}>Date</th>
                        <th style={styleTh}>Customer Name</th>
                        <th style={styleTh}>Email</th>
                        <th style={styleTh}>Phone No.</th>
                        <th style={styleTh}>Address</th>
                        <th style={styleTh}>Payment Type</th>
                        <th style={styleTh}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders?.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{formatDate(order.created_at)}</td>
                                <td>###</td>
                                <td>###</td>
                                <td>###</td>
                                <td>###</td>
                                <td>{order.payment?.payment_method}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}
// [
//     {
//       "id": 39,
//       "payment": {
//         "payment_method": "cod",
//         "payment_status": "pending",
//         "total": "1750.00",
//         "created_at": "2025-02-06T05:05:06.297335Z"
//       },
//       "invoice": {
//         "id": 39,
//         "invoice_number": "J184TIAR7P6VEZW",
//         "created_at": "2025-02-06T05:05:13.052109Z",
//         "file": null,
//         "order": 39
//       },
//       "items": [
//         {
//           "id": 49,
//           "product": {
//             "id": 1,
//             "category": {
//               "id": 1,
//               "name": "Filters",
//               "image": "/media/categories/4850091.png"
//             },
//             "brand": {
//               "id": 1,
//               "name": "Mercedes Benz",
//               "img": "/media/brands/logo.png"
//             },
//             "compatibility": [
//               {
//                 "id": 2,
//                 "model_name": "w204"
//               }
//             ],
//             "reviews": [
//               {
//                 "id": 17,
//                 "user": {
//                   "id": 1,
//                   "username": "admin",
//                   "email": ""
//                 },
//                 "review": "good",
//                 "rating": 2,
//                 "created_at": "2025-01-15T22:26:04.101570Z",
//                 "updated_at": "2025-01-15T22:26:04.102569Z",
//                 "product": 1
//               }
//             ],
//             "name": "Genuine Mercedes-Benz AIR FILTER A 274 094 00 04",
//             "name_ar": "Air Filter 274",
//             "partnumber": "A 274 094 00 04",
//             "description": "A207 Air Filter OE: 274 094 00 04\r\n\r\nHeight 1: 192.5 mm\r\n\r\nHeight 2: 255.5 mm\r\n\r\nFitted ├ÿ1/ Fitted ├ÿ2: 105.6 / 78 mm\r\n\r\nOuter diameter 1: 139 mm\r\n\r\nOuter diameter 2: 120 mm",
//             "description_ar": "A207 Air Filter OE: 274 094 00 04\r\n\r\nHeight 1: 192.5 mm\r\n\r\nHeight 2: 255.5 mm\r\n\r\nFitted ├ÿ1/ Fitted ├ÿ2: 105.6 / 78 mm\r\n\r\nOuter diameter 1: 139 mm\r\n\r\nOuter diameter 2: 120 mm",
//             "price": 250,
//             "old_price": 0,
//             "image": "/media/products/274.jpg",
//             "image2": "/media/products/img.jpeg",
//             "image3": "/media/products/img3.jpg",
//             "slug": "genuine-mercedes-benz-air-filter-a-274-094-00-04",
//             "condition": "new",
//             "quantity": 50,
//             "created_at": "2024-12-30T01:01:41.740763Z"
//           },
//           "quantity": 7,
//           "created_at": "2025-02-06T07:04:59.129247Z",
//           "order": 39
//         }
//       ],
//       "status": "completed",
//       "created_at": "2025-02-06T05:04:59.034553Z",
//       "updated_at": "2025-02-06T05:05:12.959108Z",
//       "user": 5,
//       "address": 4
//     }
//   ]