import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({dataset}) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    useEffect(()=>{
        setChartData({labels:dataset?.labels,datasets: [
            {
              label: "Products Sold",
              data: dataset?.total,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],})
    },[dataset])
  

  return (
    <div>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default SalesChart;
