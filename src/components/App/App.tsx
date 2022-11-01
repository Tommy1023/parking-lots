import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from '../pages/Layout';
import Map from '../Map';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router basename="parking-lots">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="map" element={<Map />} />
              <Route path="parkingList" element={<div>ParkingList</div>} />
              <Route path="keeps" element={<div>keeps</div>} />
              <Route path="user" element={<div>user</div>} />
              <Route path="setting" element={<div>setting</div>} />
            </Route>
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
};

export default App;
