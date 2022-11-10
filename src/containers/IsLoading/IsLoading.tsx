import React, { useEffect } from 'react';
import shallow from 'zustand/shallow';
import { FaSpinner } from 'react-icons/fa';
import { useMatch } from 'react-router-dom';
import useStore from '../../store';

const IsLoading = ({ children }: { children: React.ReactElement }) => {
  const {
    isLoading,
    userCenter,
    parkingLots,
    allAvailable,
    setFilterMarker,
    setClickCoord,
    setMapCenter,
  } = useStore((state) => {
    return {
      isLoading: state.isLoading,
      userCenter: state.userCenter,
      allAvailable: state.allAvailable,
      parkingLots: state.parkingLots,
      setFilterMarker: state.setFilterMarker,
      setClickCoord: state.setClickCoord,
      setMapCenter: state.setMapCenter,
    };
  }, shallow);
  const isMatch = useMatch('/map');

  useEffect(() => {
    if (!isMatch) {
      setFilterMarker(null);
      setClickCoord(userCenter);
      setMapCenter(userCenter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !userCenter || !allAvailable || !parkingLots) {
    return (
      <div className="h-full w-full bg-light text-2xl flex-center">
        <div className="animate-spin p-2 text-primary">
          <FaSpinner />
        </div>
        <p className="text-primary">Data Loading...</p>
      </div>
    );
  }
  return children;
};

export default React.memo(IsLoading);
