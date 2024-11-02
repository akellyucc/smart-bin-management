import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
} from 'recharts';
import '../styles/ReportPage.css'; // Import a CSS file for styling
import binService from '../services/binService'; // Import the API functions

const WasteManagementReport = ({ reportData, selectedParish }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultReportData = useMemo(() => ({
    totalWaste: 1500,
    wasteByType: [
      { name: 'Plastic', value: 600 },
      { name: 'Organic', value: 400 },
      { name: 'Metal', value: 300 },
      { name: 'Paper', value: 150 },
      { name: 'Glass', value: 50 },
    ],
    wasteTrends: [
      { month: 'January', amount: 200 },
      { month: 'February', amount: 150 },
      { month: 'March', amount: 250 },
      { month: 'April', amount: 300 },
      { month: 'May', amount: 200 },
      { month: 'June', amount: 250 },
      { month: 'July', amount: 300 },
      { month: 'August', amount: 350 },
      { month: 'September', amount: 400 },
      { month: 'October', amount: 450 },
      { month: 'November', amount: 400 },
      { month: 'December', amount: 500 },
    ],
    recyclables: [
      { bin_type: "Recyclable", total_amount: 800 },
      { bin_type: "Non-Recyclable", total_amount: 700 }
    ],
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        if (selectedParish) {
          const result = await binService.fetchReportByParish(selectedParish);
          setData(result);
        } else {
          setData(defaultReportData); // Use default data if no parish is selected
        }
      } catch (err) {
        setError('Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedParish, defaultReportData]); // Add defaultReportData to dependencies

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">{error}</p>;

  const { totalWaste, wasteByType, wasteTrends, recyclables } = data;

  return (
    <div className="report-page">
      <header className="report-header">
        <h1>Waste Management and Disposal Report</h1>
        <p>Selected Parish: <strong>{selectedParish || 'None'}</strong></p>
        <p className="report-date">{new Date().toLocaleDateString()}</p>
      </header>

      <div className="main-content">
        <section className="section summary">
          <h3>Summary</h3>
          <p className="total-waste">
            Total Waste Collected: <strong>{totalWaste} tons</strong>
          </p>
          <p>
            Types of Waste: {wasteByType.map(item => item.name).join(', ')}
          </p>
        </section>

        <section className="section statistics">
          <div className="chart-container">
            <h3>Waste by Type</h3>
            <PieChart className="pie-chart" width={400} height={400}>
              <Pie
                data={wasteByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {wasteByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </section>

        <section className="section">
          <h3>Waste Collection Trends</h3>
          <div className="chart-container">
            <BarChart data={wasteTrends} width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </div>
        </section>

        <section className="section">
          <h3>Bin Types: Recyclables vs Non-Recyclables</h3>
          <div className="chart-container">
            <PieChart className="pie-chart" width={400} height={400}>
              <Pie
                data={recyclables}
                dataKey="total_amount"
                nameKey="bin_type"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#82ca9d"
                label
              >
                {recyclables.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#36A2EB' : '#FF6384'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tons`, 'Amount']} />
              <Legend />
            </PieChart>
          </div>
        </section>

        <section className="section recommendations">
          <h2>Recommendations</h2>
          <ul>
            <li>Increase recycling efforts for plastic waste.</li>
            <li>Implement community awareness programs.</li>
            <li>Conduct regular audits of waste management practices.</li>
            <li>Explore partnerships with local recycling facilities.</li>
          </ul>
        </section>

        <footer className="report-footer">
          <p>Contact us: smartbins@smartbinsmanagement.com</p>
        </footer>
      </div>
    </div>
  );
};

export default WasteManagementReport;
