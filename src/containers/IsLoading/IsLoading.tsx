import React from 'react';
import shallow from 'zustand/shallow';
import useStore from '../../store';

const IsLoading = ({ children }: { children: React.ReactElement }) => {
  const { isLoading, userCenter, parkingLots } = useStore((state) => {
    return {
      isLoading: state.isLoading,
      userCenter: state.userCenter,
      parkingLots: state.parkingLots,
    };
  }, shallow);

  if (isLoading || !userCenter || !parkingLots) {
    return (
      <div className="h-full w-full text-2xl flex-center">
        <p>Data Loading...</p>
      </div>
    );
  }
  return children;
};

export default React.memo(IsLoading);
