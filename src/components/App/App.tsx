import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import Home from '../pages/Home';
import Layout from '../pages/Layout';
import Map from '../pages/Map';
import List from '../pages/List';

const App = () => {
  const { init } = useStore((state) => {
    return {
      init: state.init,
    };
  }, shallow);

  useEffect(() => {
    init();
  }, []);//eslint-disable-line

  return (
    <div>
      <Router basename="parking-lots">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="map" element={<Map />} />
            <Route path="parkingList" element={<List />} />
            <Route
              path="keeps"
              element={
                <div className="h-full w-full flex-center">
                  <div>Keeps 施工中...</div>
                </div>
              }
            />
            <Route
              path="user"
              element={
                <div className="h-full w-full flex-center">
                  <div>User 施工中...</div>
                </div>
              }
            />
            <Route
              path="setting"
              element={
                <div className="h-full w-full flex-center">
                  <div>Setting 施工中...</div>
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
