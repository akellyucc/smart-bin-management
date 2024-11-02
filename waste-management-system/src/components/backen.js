const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("New client connected");

  // Simulate sending notifications
  setInterval(() => {
    socket.emit("notification", {
      message: "Bin 101 is Full!",
      status: "red"
    });
  }, 5000); // Sends notification every 5 seconds

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalBins: 0,
    fullBins: 0,
    nearFullBins: 0,
    lastCollection: '',
    activeRoutes: 0,
    totalWaste: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/metrics'); // Fetch metrics from your backend
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 10000); // Fetch data every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="dashboard">
      <div className="metric-card">
        <span className="icon">🗑️</span>
        <div className="metric-info">
          <h3>Total Bins Monitored</h3>
          <p>{metrics.totalBins}</p>
        </div>
      </div>
      {/* Similar for other metrics */}
    </div>
  );
};

export default Dashboard;
