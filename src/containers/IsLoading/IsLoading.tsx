import React from 'react';
import shallow from 'zustand/shallow';
import { FaSpinner } from 'react-icons/fa';
import useStore from '../../store';

const IsLoading = ({ children }: { children: React.ReactElement }) => {
  const { isLoading, userCenter, parkingLots, allAvailable } = useStore((state) => {
    return {
      isLoading: state.isLoading,
      userCenter: state.userCenter,
      allAvailable: state.allAvailable,
      parkingLots: state.parkingLots,
    };
  }, shallow);

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
