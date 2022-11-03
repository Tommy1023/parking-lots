import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useStore from '../../store';
import './App.css';
import Layout from '../pages/Layout';
import Map from '../pages/Map';
import List from '../pages/List';

const queryClient = new QueryClient();

const App = () => {
  const { getParkingLots, getAllAvailable } = useStore((state) => {
    return {
      getParkingLots: state.getParkingLots,
      getAllAvailable: state.getAllAvailable,
    };
  });

  useEffect(() => {
    getParkingLots();
    getAllAvailable();
  }, []);//eslint-disable-line
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router basename="parking-lots">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="map" element={<Map />} />
              <Route path="parkingList" element={<List />} />
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
