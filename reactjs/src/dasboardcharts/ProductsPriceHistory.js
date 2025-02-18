import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axiosInstance from '../components/axiosInstance';

// ✅ Register required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
// Need display all products in one chart in first render

export default function ProductsPriceHistory() {
    const [dataset, setDataset] = useState({});
    const [chartData, setChartData] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosInstance.get('/d/history/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
            .then((res) => {
                console.log(res.data);
                setDataset(res.data.products_price_history);
                setProducts(res.data.products);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const fetchProductHistory = (productId) => {
        if (!productId) return;
    
        // Get product name before making API request
        const selectedProduct = products.find((p) => p.id === parseInt(productId));
        if (!selectedProduct) return;
    
        axiosInstance.post('/d/history/', { id: productId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        .then((res) => {
            console.log("Fetched product history:", res.data);
    
            // ✅ Transform API response
            const labels = res.data.map(entry => entry.changed_at.split("T")[0]); // Extract date
            const prices = res.data.map(entry => parseFloat(entry.new_price)); // Convert to float
    
            setChartData({
                labels,
                datasets: [
                    {
                        label: selectedProduct.name, // ✅ Use selected product name directly
                        data: prices,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        tension: 0.4,
                        fill: true,
                    }
                ]
            });
        })
        .catch((err) => {
            console.log(err);
        });
    };
    

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 14 } } },
            title: { display: true, text: 'Product Price History', font: { size: 16 } },
            tooltip: { mode: 'index', intersect: false },
        },
        scales: {
            x: { title: { display: true, text: "Date" } },
            y: { title: { display: true, text: "Price (EGP)" } }
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <select className="form-select form-select-sm my-3" onChange={(e) => fetchProductHistory(e.target.value)}>
                        <option value="">--- Select Product ---</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {chartData ? <Line options={options} data={chartData} /> : <p>Select a product to view history</p>}
        </>
    );
}
