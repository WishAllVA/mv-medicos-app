import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axiosInstance from '../../axiosConfig';
import './Reports.css';

import {
    Chart as ChartJS,
    CategoryScale, // For categorical X-axis (e.g., 'Day 1', 'Day 2')
    LinearScale,   // For numerical Y-axis
    PointElement,  // For points on the line
    LineElement,   // For the line itself
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const dummyChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
        {
            label: 'Total Amount of Bills',
            data: [100, 200, 150, 300, 250, 400, 350],
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
        }
    ]
};

const dummyMedicinesData = [
    { name: 'Paracetamol', sold: 500 },
    { name: 'Ibuprofen', sold: 450 },
    { name: 'Aspirin', sold: 400 },
    { name: 'Amoxicillin', sold: 350 },
    { name: 'Ciprofloxacin', sold: 300 },
];

const Reports = () => {
    const [timeRange, setTimeRange] = useState('7');
    const [chartType, setChartType] = useState('line');
    const [dataType, setDataType] = useState('amount');
    const [chartData, setChartData] = useState(null);
    const [medicinesData, setMedicinesData] = useState([]);

    useEffect(() => {
        fetchData();
        fetchMedicinesData();
    }, [timeRange, dataType]);

    const fetchData = async () => {
        try {
            const endpoint = dataType === 'amount' ? '/api/reports/total-amount' : '/api/reports/total-bills';
            const response = await axiosInstance.get(`${endpoint}?days=${timeRange}`);
            const data = response.data;
            setChartData({
                labels: data.labels,
                datasets: [
                    {
                        label: dataType === 'amount' ? 'Total Amount of Bills' : 'Total Number of Bills',
                        data: dataType === 'amount' ? data.amounts : data.bills,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('There was an error fetching the reports!', error);
        }
    };

    const fetchMedicinesData = async () => {
        try {
            const response = await axiosInstance.get('/api/reports/top-sold-medicine');
            response.data && setMedicinesData(response.data.topSoldMedicines);
        } catch (error) {
            console.error('There was an error fetching the top sold medicines!', error);
        }
    };

    return (
        <div className="reports">
            <h2>Reports</h2>
            <div className="main-content">
                <div className="chart-section">
                    <div className="dropdown">
                        <label htmlFor="timeRange">Select Time Range: </label>
                        <select
                            id="timeRange"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="365">Last 365 days</option>
                        </select>
                    </div>
                    <div className="dropdown">
                        <label htmlFor="chartType">Select Chart Type: </label>
                        <select
                            id="chartType"
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                        >
                            <option value="line">Line Chart</option>
                            <option value="bar">Bar Chart</option>
                        </select>
                    </div>
                    <div className="dropdown">
                        <label htmlFor="dataType">Select Data Type: </label>
                        <select
                            id="dataType"
                            value={dataType}
                            onChange={(e) => setDataType(e.target.value)}
                        >
                            <option value="amount">Total Amount</option>
                            <option value="bills">Total Bills</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        {chartData && chartType === 'line' && (
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Dummy Data Chart',
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Days',
                                            },
                                            type: 'category', // Ensure category scale for X-axis
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: dataType === 'amount' ? 'Amount ($)' : 'Number of Bills',
                                            },
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        )}
                        {chartData && chartType === 'bar' && (
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Dummy Data Chart',
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Days',
                                            },
                                            type: 'category', // Ensure category scale for X-axis
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: dataType === 'amount' ? 'Amount ($)' : 'Number of Bills',
                                            },
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="medicines-section">
                    <h3>Top Sold Medicines</h3>
                    <ul>
                        {medicinesData.map((medicine, index) => (
                            <li key={index}>
                                {medicine.name} - {medicine.sold} units
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reports;
