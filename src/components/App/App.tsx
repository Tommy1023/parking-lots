import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import Layout from '../pages/Layout';
import Map from '../pages/Map';
import List from '../pages/List';

const App = () => {
  const { init, isAppInitializedComplete } = useStore((state) => {
    return {
      init: state.init,
      isAppInitializedComplete: state.isAppInitializedComplete,
    };
  }, shallow);

  useEffect(() => {
    init();
  }, []);//eslint-disable-line

  if (!isAppInitializedComplete)
    return (
      <div className="h-screen w-screen bg-[#FF6600] text-2xl  flex-center">
        應用程式初使化中...
      </div>
    );
  return (
    <div>
      <Router basename="parking-lots">
        <Routes>
          <Route path="/" element={<Layout />}>
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
