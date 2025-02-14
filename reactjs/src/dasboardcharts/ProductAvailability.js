import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProductAvailability({ dataset }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Product Availability',
                data: [],
                backgroundColor: [
                    'rgba(255, 159, 64, 1)', // In Stock
                    'rgba(54, 162, 235, 1)',  // Out of Stock
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (dataset) {
            const availabilityData = dataset;
            setChartData({
                labels: ['In Stock', 'Out of Stock'],
                datasets: [
                    {
                        label: 'Product Availability',
                        data: [availabilityData.in_stock, availabilityData.out_of_stock],
                        backgroundColor: [
                            'rgba(255, 159, 64, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderColor: [
                            'rgba(255, 159, 64, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [dataset]);

    return (
        <div style={{ height: "250px" }}>
            <Pie data={chartData} />
        </div>
    );
}

// backgroundColor: [
//     'rgba(255, 99, 132, 0.2)',
//     'rgba(54, 162, 235, 0.2)',
//     'rgba(255, 206, 86, 0.2)',
//     'rgba(75, 192, 192, 0.2)',
//     'rgba(153, 102, 255, 0.2)',
//     'rgba(255, 159, 64, 0.2)',
// ],
// borderColor: [
//     'rgba(255, 99, 132, 1)',
//     'rgba(54, 162, 235, 1)',
//     'rgba(255, 206, 86, 1)',
//     'rgba(75, 192, 192, 1)',
//     'rgba(153, 102, 255, 1)',
//     'rgba(255, 159, 64, 1)',
// ],