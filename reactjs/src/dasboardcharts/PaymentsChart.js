import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaymentsChart({ dataset }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Payments',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        console.log(dataset)
        if (dataset) {
            const paymentData = dataset;
            const labels = Object.keys(paymentData);
            const dataValues = Object.values(paymentData);

            const backgroundColors = [
                'rgba(255, 159, 64, 1)', // COD
                'rgba(54, 162, 235, 1)',  // PayPal
                'rgba(75, 192, 192, 1)', // Stripe (extra color)
                'rgba(153, 102, 255, 1)', // Bank Transfer (extra color)
            ].slice(0, labels.length); // Ensure only the required colors are used

            setChartData({
                labels: labels.map(label => label.toUpperCase()),
                datasets: [
                    {
                        label: 'Payments',
                        data: dataValues,
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors,
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
