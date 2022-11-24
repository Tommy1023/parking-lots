import React from 'react';
import shallow from 'zustand/shallow';
import { FaSpinner } from 'react-icons/fa';
import useMapStore from '../../store/useMapStore';

const IsLoading = ({ children }: { children: React.ReactElement }) => {
  const { isLoading } = useMapStore((state) => {
    return {
      isLoading: state.isLoading,
    };
  }, shallow);

  if (isLoading) {
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
