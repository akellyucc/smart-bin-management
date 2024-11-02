import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Map from './components/Map';
import Notifications from './components/Notifications';
import ActionButtons from './components/ActionButtons';
import ReportPage from './components/ReportPage';
import SchedulePickup from './components/SchedulePickup';
import './App.css';
function App() {
  const [selectedParish, setSelectedParish] = useState('');

  return (
    <Router>
      <div className="App">
        <Header onParishChange={setSelectedParish} />
        <main>
          <Routes>
            {/* Define routes */}
            <Route path="/reports" element={<ReportPage selectedParish={selectedParish}/>} />
            <Route path="/schedule-pickup" element={<SchedulePickup />} />
            <Route path="/" element={
              <>
                <Dashboard />
                <div className="content">
                  <Map selectedParish={selectedParish} />
                  <Notifications />
                </div>
                <ActionButtons />
              </>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
