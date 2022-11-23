/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import Home from '../../pages/Home';
import Layout from '../../Layout';
import Map from '../../pages/Map';
import List from '../../pages/List';

const App = () => {
  const { init, updateAllAvailable } = useStore((state) => {
    return {
      init: state.init,
      updateAllAvailable: state.updateAllAvailable,
    };
  }, shallow);

  useEffect(() => {
    init();
    const interval = setInterval(() => {
      updateAllAvailable();
    }, 300000);
    return () => {
      clearInterval(interval);
    };
  }, []);//eslint-disable-line

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="map" element={<Map />} />
            <Route path="parkingList" element={<List />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
